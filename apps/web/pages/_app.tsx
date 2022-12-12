/** @format */

import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import "../styles/globals.css";

// Remove console logs in production
if (process.env.NODE_ENV === "production") {
	console.log = () => {};
}

export default function App({ Component, pageProps, router }: AppProps) {
	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={router.route}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						easings: "easeOut",
					}}
				>
					<Component {...pageProps} />
				</motion.div>
			</AnimatePresence>
		</>
	);
}
