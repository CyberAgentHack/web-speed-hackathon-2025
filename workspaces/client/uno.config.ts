import type { IconifyJSON } from "@iconify/types";
import { defineConfig, presetIcons, presetWind3 } from "unocss";

export default defineConfig({
	content: {
		filesystem: ["./src/**/*.{html,ts,tsx,js,jsx}"],
	},
	layers: {
		default: 1,
		icons: 0,
		preflights: 0,
		reset: -1,
	},
	presets: [
		presetWind3(),
		presetIcons({
			collections: {
				bi: async () =>
					(await import("@iconify/json/json/bi.json")).default as IconifyJSON,
				bx: async () =>
					(await import("@iconify/json/json/bx.json")).default as IconifyJSON,
				"fa-regular": async () =>
					(await import("@iconify/json/json/fa-regular.json"))
						.default as IconifyJSON,
				"fa-solid": async () =>
					(await import("@iconify/json/json/fa-solid.json"))
						.default as IconifyJSON,
				fluent: async () =>
					(await import("@iconify/json/json/fluent.json"))
						.default as IconifyJSON,
				"line-md": async () =>
					(await import("@iconify/json/json/line-md.json"))
						.default as IconifyJSON,
				"material-symbols": async () =>
					(await import("@iconify/json/json/material-symbols.json"))
						.default as IconifyJSON,
			},
		}),
	],
});
