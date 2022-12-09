/** @format */

import type { AppProps } from "next/app";
import "../styles/globals.css";

// Remove console logs in production
if (process.env.NODE_ENV === "production") {
	console.log = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
