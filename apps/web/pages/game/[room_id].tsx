/** @format */

import { getPlayer } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { Player } from "@troof/socket";
import { AxiosError, isAxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { NextPageContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import Container from "../../components/Container";
import FullScreenLoadingScreen from "../../components/FullScreenLoadingScreen";
// import MainItemSection from "../../components/game/MainItemSection";
// import RoomCodeSection from "../../components/game/RoomCodeSection";
// import ChatBox from "../../components/message/ChatBox";

// Dynamically imported components
// https://nextjs.org/docs/advanced-features/dynamic-import
const ChatBox = dynamic(() => import("../../components/message/ChatBox"), {
	ssr: false,
});
const MainItemSection = dynamic(
	() => import("../../components/game/MainItemSection"),
	{ ssr: false }
);
const RoomCodeSection = dynamic(
	() => import("../../components/game/RoomCodeSection"),
	{ ssr: false }
);
const EmojiReactionScreen = dynamic(
	() => import("../../components/message/EmojiReactionScreen"),
	{ ssr: false }
);
const Players = dynamic(() => import("../../components/Players"), {
	ssr: false,
});
// import EmojiReactionScreen from "../../components/message/EmojiReactionScreen";
// import Players from "../../components/Players";
import { useGameContext } from "../../context/GameContext";
import { GameRoomProvider } from "../../context/GameRoomProvider";
import { PublicKeyProvider } from "../../context/PublicKeyProvider";
import { useRoomContext } from "../../context/RoomContext";
import { SocketProvider } from "../../context/SocketProvider";
import { Cookie } from "../../utils/Cookie";

export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	let { room_id } = context.query;

	let player_id = Cookie.getPlayerID(context.req, context.res);

	let token = Cookie.getToken(context.req, context.res);

	if (!player_id || !token) {
		return {
			redirect: {
				destination: "/?room_id=" + room_id,
				permanent: true,
			},
		};
	}

	try {
		// Find the player using the API
		const playerAPIData = await getPlayer(token);
		const player = playerAPIData.data.data;

		if (!player) {
			return {
				redirect: {
					destination: "/",
					permanent: true,
				},
			};
		}

		const rtnPlayer: Player = {
			is_party_leader: player.is_party_leader,
			display_name: player.display_name,
			player_id: player.player_id,
			game_room_id: player.game_room_id,
			joined_at: null,
		};

		return {
			props: {
				// Pass the query string to the page
				r: room_id,
				player: rtnPlayer,
			},
		};
	} catch (error) {
		if (isAxiosError(error)) {
			let e: AxiosError<BadRequest | NotFoundResponse> = error;

			console.log(e);

			if (!e.response) {
				// The user does not have an internet connection because there is no error response hence why there is no reply from server
				console.log(
					"The user does not have an internet connection because there is no error response (No connection to server)"
				);
				return {
					redirect: {
						destination:
							"/?error=An unknown error occurred. Please try again later. (No connection to server)",
						permanent: true,
					},
				};
			}

			let {
				data: { message },
			} = e.response;
			return {
				redirect: {
					destination: `/?error=${message}`,
					permanent: true,
				},
			};
		}

		return {
			redirect: {
				destination:
					"/?error=An unknown error occurred. Please try again later.",
				permanent: false,
			},
		};
	}
}

export default function GamePage({
	r: roomID,
	player,
}: {
	r: string;
	player: Player;
}) {
	const router = useRouter();

	// ! ANIMATION
	return (
		<>
			<motion.div
				key={router.route}
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
					<GameRoomProvider room_id={roomID} initialPlayer={player}>
					<motion.div
						key={router.route}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 2.1,
							easings: "easeIn",
						}}
					>
						<GamePageContent />
					</motion.div>
					</GameRoomProvider>
				</SocketProvider>
			</PublicKeyProvider>
		</>
	);
}

function GamePageContent() {
	const { room_id, players } = useRoomContext();
	const { hasReceivedPlayers, hasReceivedGameStatus, hasReceivedPublicKey } = useGameContext();

	return (
		<Container>
			<Head>
				<title>Troof! ({room_id})</title>
				{/* meta description */}

				{players.length < 2 ? (
					<meta name="description" content="Come join me play truth or dare!" />
				) : (
					<meta
						name="description"
						content={`Come join me and ${
							players.length - 1
						} other people play truth or dare!`}
					/>
				)}
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<EmojiReactionScreen />

			<AnimatePresence>
				{!hasReceivedGameStatus &&
					!hasReceivedPlayers &&
					!hasReceivedPublicKey && <FullScreenLoadingScreen />}
			</AnimatePresence>

			<div className="h-screen py-10 ">
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
