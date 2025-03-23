import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import fastifyStatic from "@fastify/static";
import { StoreProvider } from "@wsh-2025/client/src/app/StoreContext";
import { createRoutes } from "@wsh-2025/client/src/app/createRoutes";
import { createStore } from "@wsh-2025/client/src/app/createStore";
import type { FastifyInstance } from "fastify";
import { createStandardRequest } from "fastify-standard-request-reply";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
	createStaticHandler,
	createStaticRouter,
	StaticRouterProvider,
} from "react-router";

function getFiles(parent: string): string[] {
	const dirents = readdirSync(parent, { withFileTypes: true });
	return dirents
		.filter((dirent) => dirent.isFile() && !dirent.name.startsWith("."))
		.map((dirent) => path.join(parent, dirent.name));
}

// function getFilePaths(relativePath: string, rootDir: string): string[] {
// 	const files = getFiles(path.resolve(rootDir, relativePath));
// 	return files.map((file) => path.join("/", path.relative(rootDir, file)));
// }

export function registerSsr(app: FastifyInstance): void {
	app.register(fastifyStatic, {
		prefix: "/public/",
		root: [
			path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				"../../client/dist",
			),
			path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				"../../../public",
			),
		],
	});

	app.get("/favicon.ico", (_, reply) => {
		reply.status(404).send();
	});

	app.get("/*", async (req, reply) => {
		// @ts-expect-error ................
		const request = createStandardRequest(req, reply);

		const store = createStore({});
		const handler = createStaticHandler(createRoutes(store));
		const context = await handler.query(request);

		if (context instanceof Response) {
			return reply.send(context);
		}

		const router = createStaticRouter(handler.dataRoutes, context);
		const appHtml = renderToString(
			<StrictMode>
				<StoreProvider createStore={() => store}>
					<StaticRouterProvider context={context} router={router} />
				</StoreProvider>
			</StrictMode>,
		);

		const html = `<html className="size-full" lang="ja">
			<head>
				<meta charSet="UTF-8" />
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
				<link rel="stylesheet" href="/public/uno.css" />
				<script src="/public/main.js" defer></script>
			</head>
			<body>
<div id="app"><!--app-html--></div>
			</body>
		</html>`;

		reply
			.type("text/html")
			.send(`<!DOCTYPE html>${html.replace("<!--app-html-->", appHtml)}`);
	});
}
