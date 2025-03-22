import path from "node:path";

import webpack from "webpack";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

/** @type {import('webpack').Configuration} */
const config = {
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
								{
									targets: { chrome: "134" },
									useBuiltIns: false,
								},
							],
							["@babel/preset-react", { runtime: "automatic" }],
							["@babel/preset-typescript"],
						],
					},
				},
			},
			{
				test: /\.(png|jpeg|jpg|gif|svg)$/i,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 8 * 1024, // 8KB以下の画像はインライン化
					},
				},
			},
			{
				test: /\.(?:jpe?g|png|svg|gif|webp|ico|mp4|mp3|wav|ogg|wasm|json|csv|xml|yaml|toml|htm|html)$/,
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
		],
	},
	output: {
		chunkFilename: "chunk-[contenthash].js",
		chunkFormat: false,
		filename: "main.js",
		path: path.resolve(import.meta.dirname, "./dist"),
		publicPath: "auto",
	},
	plugins: [
		new webpack.EnvironmentPlugin({ API_BASE_URL: "/api", NODE_ENV: "" }),
		// new BundleAnalyzerPlugin()
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
