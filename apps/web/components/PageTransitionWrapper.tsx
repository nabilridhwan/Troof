/** @format */

"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Remove console logs in production
if (process.env.NODE_ENV === "production") {
	console.log = () => {};
}

export default function PageTransitionWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		// <AnimatePresence>
			<motion.div
				key={pathname}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{
					easings: "easeOut",
				}}
			>
				{children}
			</motion.div>
		// </AnimatePresence>
	);
}
