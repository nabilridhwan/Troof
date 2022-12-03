/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
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
				drop: "drop 3s ease-in forwards",
			},

			keyframes: {
				drop: {
					"0%": {
						transform: "translateY(0)",
						opacity: 0,
					},

					"50%": {
						opacity: 1,
					},

					"100%": {
						transform: "translateY(100vh)",
						opacity: 0,
					},
				},
			},
		},
	},
	plugins: [],
};
