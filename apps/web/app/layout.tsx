/** @format */

import type { Metadata } from "next";
import "../styles/globals.css";
import PageTransitionWrapper from "../components/PageTransitionWrapper";

export const metadata: Metadata = {
	title: "Troof! - Experience the ultimate social truth or dare game - see, chat, and react together with your friends!",
	description:
		"Experience the ultimate social truth or dare game - see, chat, and react together with your friends!",
	openGraph: {
		images: ["https://troof.nabilridhwan.com/troof_promo_new.png"],
	},
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<body>
				<PageTransitionWrapper>{children}</PageTransitionWrapper>
			</body>
		</html>
	);
}
