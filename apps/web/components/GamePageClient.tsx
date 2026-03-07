/** @format */

"use client";

import { Player, RoomBootstrapState } from "@troof/socket";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useGameContext } from "../context/GameContext";
import { GameRoomProvider } from "../context/GameRoomProvider";
import { PublicKeyProvider } from "../context/PublicKeyProvider";
import { useRoomContext } from "../context/RoomContext";
import { SocketProvider } from "../context/SocketProvider";
import Container from "./Container";
import FullScreenLoadingScreen from "./FullScreenLoadingScreen";

// Dynamically imported components
// https://nextjs.org/docs/advanced-features/dynamic-import
const ChatBox = dynamic(() => import("./message/ChatBox"), {
	ssr: false,
});
const MainItemSection = dynamic(() => import("./game/MainItemSection"), {
	ssr: false,
});
const RoomCodeSection = dynamic(() => import("./game/RoomCodeSection"), {
	ssr: false,
});
const EmojiReactionScreen = dynamic(
	() => import("./message/EmojiReactionScreen"),
	{ ssr: false }
);
const Players = dynamic(() => import("./Players"), {
	ssr: false,
});

export default function GamePageClient({
	roomId,
	player,
	bootstrap,
}: {
	roomId: string;
	player: Player;
	bootstrap: RoomBootstrapState;
}) {
	const pathname = usePathname();

	return (
		<>
			<motion.div
				key={pathname}
				initial={{
					x: "200%",
					skewX: "-10deg",
					scaleX: 2,
				}}
				animate={{
					x: "-200%",
					transition: {
						duration: 2,
						ease: "easeOut",
					},
				}}
				transition={{ ease: "easeOut", type: "tween" }}
				className="fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center bg-stone-400"
			></motion.div>
			<PublicKeyProvider>
				<SocketProvider>
					<GameRoomProvider
						room_id={roomId}
						initialPlayer={player}
						initialBootstrap={bootstrap}
					>
						<GamePageContent />
					</GameRoomProvider>
				</SocketProvider>
			</PublicKeyProvider>
		</>
	);
}

function GamePageContent() {
	const { room_id, players } = useRoomContext();
	const { hasReceivedPlayers, hasReceivedGameStatus, hasReceivedPublicKey } =
		useGameContext();

	return (
		<Container>
			<EmojiReactionScreen />

			<AnimatePresence>
				{!hasReceivedGameStatus &&
					!hasReceivedPlayers &&
					!hasReceivedPublicKey && <FullScreenLoadingScreen />}
			</AnimatePresence>

			<div className="h-screen py-10">
				<div className="h-full items-center justify-center gap-10 lg:grid lg:grid-cols-4">
					<div className="col-span-1 rounded-2xl border-black/10 px-1 lg:h-full lg:border">
						{players.length < 8 && (
							<div className="m-2 mb-6 rounded-xl border border-black/25 bg-white/30">
								<RoomCodeSection />
							</div>
						)}

						<div>
							<h2 className={`my-5 text-center text-lg font-bold`}>
								Players ({players.length}/8)
							</h2>
							<Players />
						</div>
					</div>

					{/* Main Content */}
					<div className="col-span-2 rounded-2xl border-black/10 lg:h-full lg:border lg:px-10">
						<div className="flex h-full w-full items-center justify-center">
							<MainItemSection />
						</div>
					</div>

					<div className="col-span-1 py-5 lg:h-full lg:py-0">
						<ChatBox />
					</div>
				</div>
			</div>
		</Container>
	);
}
