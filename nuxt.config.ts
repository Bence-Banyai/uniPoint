// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-02-23",

	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5001", // Your backend URL
		},
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
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@nuxt/icon", "@nuxt/image"],

	googleFonts: {
		families: {
			Montserrat: true,
		},
	},
});
