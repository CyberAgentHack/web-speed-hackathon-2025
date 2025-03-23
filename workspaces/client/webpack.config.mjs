import path from "node:path";

import UnoCSS from "@unocss/postcss";
import webpack from "webpack";

/** @type {import('webpack').Configuration} */
const config = {
	// devtool: "inline-source-map",
	entry: "./src/main.tsx",
	mode: "production",
	module: {
		rules: [
			{
				exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
				resolve: {
					fullySpecified: false,
				},
				test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
							],
							["@babel/preset-react", { runtime: "automatic" }],
							["@babel/preset-typescript"],
						],
					},
				},
			},
			{
				test: /\.png$/,
				type: "asset/inline",
			},
			{
				resourceQuery: /raw/,
				type: "asset/source",
			},
			{
				resourceQuery: /arraybuffer/,
				type: "javascript/auto",
				use: {
					loader: "arraybuffer-loader",
				},
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["postcss-preset-env", UnoCSS()],
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		realContentHash: true,
	},
	output: {
		chunkFilename: "chunk-[contenthash].js",
		filename: "main.js",
		path: path.resolve(import.meta.dirname, "./dist"),
		publicPath: "auto",
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
		new webpack.EnvironmentPlugin({ API_BASE_URL: "/api", NODE_ENV: "" }),
	],
	resolve: {
		alias: {
			"@ffmpeg/core$": path.resolve(
				import.meta.dirname,
				"node_modules",
				"@ffmpeg/core/dist/umd/ffmpeg-core.js",
			),
			"@ffmpeg/core/wasm$": path.resolve(
				import.meta.dirname,
				"node_modules",
				"@ffmpeg/core/dist/umd/ffmpeg-core.wasm",
			),
		},
		extensions: [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts", ".tsx", ".jsx"],
	},
};

export default config;
