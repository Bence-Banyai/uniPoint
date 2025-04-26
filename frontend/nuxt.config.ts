// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-02-23",

	runtimeConfig: {
		public: {
			// Read from environment variable, fallback for safety (though .env should provide it)
			apiBaseUrl:
				process.env.API_BASE_URL ||
				"https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net",
		},
	},

	auth: {
		provider: {
			type: "local",
		},
		globalAppMiddleware: {
			isEnabled: false,
		},
		// Use the same environment variable for consistency
		baseURL:
			process.env.API_BASE_URL ||
			"https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net",
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
		// Preload these icon sets to avoid runtime CDN fetches and failures
		collections: [
			'entypo',
			'iconoir'
		]
	},

	googleFonts: {
		families: {
			Montserrat: true,
		},
	},

	nitro: {
		devProxy: {
			"/api": {
				// Point the dev proxy to the Azure backend for local testing against deployed backend
				target: "https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net",
				changeOrigin: true,
				prependPath: false,
			},
		},
	},

	imports: {
		dirs: ["stores", "composables", "utils"],
	},
});
