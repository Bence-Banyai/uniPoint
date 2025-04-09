// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-02-23",

	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5273", // Your backend URL
		},
	},

	auth: {
		provider: {
			type: "local", // Use a custom auth provider instead of Auth.js
		},
		globalAppMiddleware: {
			isEnabled: false, // Enable this later when auth is working
		},
		baseURL: process.env.API_BASE_URL || "http://localhost:5273", // Set the base URL for auth requests
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

	googleFonts: {
		families: {
			Montserrat: true,
		},
	},

	nitro: {
		devProxy: {
			"/api": {
				target: process.env.API_BASE_URL || "http://localhost:5273",
				changeOrigin: true,
				prependPath: false, // Change this to false
			},
		},
	},

	imports: {
		dirs: ["stores", "composables", "utils"],
	},
});
