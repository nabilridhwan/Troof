/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
	content: [
		"../../packages/**/*.{jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				Poppins: ["Poppins"],
				Playfair: ["Playfair Display"],
			},
			colors: {
				primary: "#efede9",
				text: "#21211f",
			},

			animation: {
				drop: "drop 2s ease-in forwards",
				zoom: "zoom 3s ease-in-out infinite",
			},

			keyframes: {
				zoom: {
					"0%": {
						transform: "scale(1)",
					},
					"50%": {
						transform: "scale(1.2)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},

				drop: {
					"0%": {
						marginTop: 0,
						opacity: 0,
					},

					"50%": {
						opacity: 1,
					},

					"100%": {
						marginTop: "calc(100vh + 20%)",
						opacity: 0,
					},
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/line-clamp"),
	],
};
