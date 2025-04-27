// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-02-23",

	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL,
		},
	},

	auth: {
		provider: {
			type: "local",
		},
		globalAppMiddleware: {
			isEnabled: false,
		},
		baseURL: process.env.API_BASE_URL,
	},

	future: {
		compatibilityVersion: 4,
	},

	experimental: {
		scanPageMeta: "after-resolve",
		sharedPrerenderData: false,
		compileTemplate: true,
		resetAsyncDataToUndefined: true,
		templateUtils: true,
		relativeWatchPaths: true,
		normalizeComponentNames: false,
		spaLoadingTemplateLocation: "within",
		defaults: {
			useAsyncData: {
				deep: true,
			},
		},
	},

	features: {
		inlineStyles: true,
	},

	unhead: {
		renderSSRHeadOptions: {
			omitLineBreaks: false,
		},
	},

	devtools: { enabled: true },
	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxtjs/google-fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@sidebase/nuxt-auth",
		"@pinia/nuxt",
	],

	icon: {
		collections: ["entypo", "iconoir"],
	},

	googleFonts: {
		families: {
			Montserrat: true,
		},
	},

	nitro: {
		devProxy: {
			"/api": {
				target: process.env.API_BASE_URL,
				changeOrigin: true,
				prependPath: false,
			},
		},
	},

	imports: {
		dirs: ["stores", "composables", "utils"],
	},
});
