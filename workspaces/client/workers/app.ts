import { createRequestHandler } from "react-router";

declare global {
  interface CloudflareEnvironment extends Env {}
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      ctx: ExecutionContext;
      env: CloudflareEnvironment;
    };
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { ctx, env },
    });
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
