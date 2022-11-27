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
		},
	},
	plugins: [],
};
