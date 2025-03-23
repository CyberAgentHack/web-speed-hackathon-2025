import presetWind3 from "@unocss/preset-wind3";
import fs from "node:fs";
import { resolve } from "node:path";

import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	// UnoCSS単体のビルド用
	build: {
		// UnoCSS出力用のディレクトリ
		outDir: "dist",
		// 既存のdistディレクトリを消さないように設定
		emptyOutDir: false,
		// CSSのみを出力するための設定
		assetsDir: "",
		// JSファイルを最小限に
		write: true,
		minify: "terser",
		terserOptions: {
			compress: {
				passes: 2,
			},
			format: {
				comments: false,
			},
		},
		rollupOptions: {
			input: resolve(__dirname, "src/unocss-entry.ts"),
			output: {
				assetFileNames: "uno.css",
				entryFileNames: "empty-[hash].js",
			},
		},
	},
	plugins: [
		UnoCSS({
			configFile: resolve("./src/setups/unocss.config.ts"),
			// mode: "dist-chunk",
			// presets: [presetWind3()],
		}),
		// JSファイルを削除するカスタムプラグイン
		// {
		// 	name: "remove-js-files",
		// 	closeBundle() {
		// 		// ビルド完了後にJSファイルを削除
		// 		const distDir = resolve(__dirname, "dist");
		// 		const files = fs.readdirSync(distDir);
		// 		for (const file of files) {
		// 			if (file.startsWith("empty-") && file.endsWith(".js")) {
		// 				fs.unlinkSync(resolve(distDir, file));
		// 			}
		// 		}
		// 	},
		// },
	],
});
