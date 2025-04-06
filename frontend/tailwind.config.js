/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{vue,js,ts}",
		"./layouts/**/*.{vue,js,ts}",
		"./pages/**/*.{vue,js,ts}",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
	],
	theme: {
		extend: {
			colors: {
				"dodgeroll-gold": "#F79F1A",
				"apple-green": "#046E1B",
				"dire-wolf": "#292727",
			},
		},
		fontFamily: {
			Montserrat: "Montserrat, sans-serif",
		},
		container: {
			center: true,
			padding: "2rem",
		},
	},
	plugins: [],
};
