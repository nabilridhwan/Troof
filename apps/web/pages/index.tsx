/** @format */

import { getPlayer, getRoom } from "@troof/api";
import { Player } from "@troof/socket";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CautionSection from "../components/home/CautionSection";
import CreateRoomSection from "../components/home/CreateRoomSection";
import JoinRoomSection from "../components/home/JoinRoomSection";
import { Cookie } from "../utils/Cookie";

import Image from "next/image";
import AccidentallyLeftGame from "../components/home/AccidentallyLeftGameSection";
import RequestForNotificationSection from "../components/home/RequestForNotificationSection";
import ServerErrorSection from "../components/home/ServerErrorSection";
import VersionSection from "../components/home/VersionSection";
import troofPromoImage from "../public/troof_promo_new_new.png";
import { Notify } from "../utils/Notify";

type MainScreenAction = "create" | "join" | "existing_game" | "none";

export default function Home() {
	const { query } = useRouter();

	const { room_id = "", error } = query;

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [roomIDInput, setRoomIDInput] = useState<string>(room_id as string);
	const [displayName, setDisplayName] = useState<string>("");
	const [showExistingGameModal, setShowExistingGameModal] =
		useState<boolean>(false);

	const [showCautions, setShowCautions] = useState<boolean>(false);

	// This state changes when the person presses the "Join" or "Create" button
	const [clickedAlready, setClickedAlready] = useState<boolean>(false);

	const [mainScreenAction, setMainScreenAction] =
		useState<MainScreenAction>("join");

	const [existingGameExists, setExistingGameExists] = useState<boolean>(false);

	const [serverVersion, setServerVersion] = useState<string>("");
	const [serverError, setServerError] = useState<string>("");

	const handleJoinGameButtonClick = () => {
		if (displayName.trim().length > 0 && roomIDInput.trim().length > 0) {
			// Redirect to the join page
			window.location.href = `/join/${roomIDInput}?display_name=${displayName}`;
			setClickedAlready(true);
		}
	};

	const handleCreateRoomButtonClick = () => {
		if (displayName.trim().length > 0) {
			// Redirect to the create page
			window.location.href = "/create?display_name=" + displayName;
			setClickedAlready(true);
		}
	};

	const joinBackExistingGame = () => {
		const roomIDFromCookies = Cookie.getRoomId();
		window.location.href = `/game/${roomIDFromCookies}`;
	};

	useEffect(() => {
		setRoomIDInput(room_id as string);
	}, [room_id]);

	useEffect(() => {
		setErrorMessage(error as string);
	}, [error]);

	useEffect(() => {
		console.log(Cookie.getPlayerID());
		console.log(Cookie.getRoomId());
		const show = !!localStorage.getItem("cautionDismissed");
		console.log("Show caution?", show);

		const displayName = localStorage.getItem("displayName");

		if (displayName) {
			setDisplayName(displayName);
		}

		setShowCautions(!show);
	}, []);

	const getPlayerFromAPI = async (token: string) => {
		let playerAPIData;

		try {
			// Find the player using the API
			playerAPIData = await getPlayer(token);

			const player: Player = playerAPIData.data.data;

			if (!player) {
				return null;
			}

			return player;
		} catch (error) {
			return null;
		}
	};

	const getRoomFromAPI = async (room_id: string) => {
		try {
			const room = await getRoom(room_id);
			return room.data;
		} catch (error) {
			return null;
		}
	};

	async function getNotifyPermission() {
		return Notify.requestForNotificationPermission();
	}

	useEffect(() => {
		(async () => {
			const roomIDFromCookies = Cookie.getRoomId();
			const token = Cookie.getToken();

			if (roomIDFromCookies && token) {
				console.log("Room ID and player ID found in cookies");
				// Get these data from API
				const playerPromise = getPlayerFromAPI(token);
				const roomPromise = getRoomFromAPI(roomIDFromCookies);

				await Promise.all([playerPromise, roomPromise]).then((values) => {
					const [player, room] = values;
					console.log("Player from API: ", !!player, "Room from API: ", !!room);

					if (player && room) {
						console.log("The room and player is still valid");
						setExistingGameExists(true);
						setShowExistingGameModal(true);
						// Redirect to the game page
						// window.location.href = `/game/${roomIDFromCookies}`;
					}
				});
			}
		})();
	}, []);

	return (
		<div>
			<Head>
				<title>
					Troof! - Experience the ultimate social truth or dare game - see,
					chat, and react together with your friends!
				</title>
				<meta
					name="description"
					content="Experience the ultimate social truth or dare game - see, chat, and react together with your friends!"
				/>

				{/* Og image */}
				<meta
					property="og:image"
					content={`https://troof.nabilridhwan.com/troof_promo_new.png`}
				/>

				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* TODO: Re-enable notification section */}
			<RequestForNotificationSection />

			<main className="mx-auto w-[90%] text-center lg:w-[55%]">
				<div>
					<div className="my-10 grid gap-10 lg:grid-cols-2">
						<div className="lg:text-left">
							<motion.h1 className="my-10 h-auto items-center font-Playfair text-8xl font-black ">
								{"Troof!".split("").map((char, index) => (
									<motion.span
										key={index}
										initial={{ opacity: 0, y: 30 }}
										animate={{
											opacity: 1,
											y: 0,
										}}
										transition={{
											delay: 0.2 + index * 0.1,
										}}
										className="inline-block"
									>
										{char}
									</motion.span>
								))}
							</motion.h1>

							<p className="mb-5 text-lg">
								Experience the ultimate social truth or dare game - see, chat,
								and react together with up to 8 friends!
							</p>

							<p className="my-5">
								First time? Check out{" "}
								<Link href="/manual" className="text-red-600">
									How to Play
								</Link>{" "}
							</p>
						</div>

						<div className="flex items-center justify-center">
							<Image
								height={900}
								src={troofPromoImage}
								alt="Troof promo image"
								priority={true}
							/>
						</div>
					</div>

					{showCautions && (
						<CautionSection onClose={() => setShowCautions(false)} />
					)}

					<ServerErrorSection />

					<p className="text-red-500">{errorMessage}</p>

					<div className="flex flex-wrap justify-around py-5">
						<div
							className="my-2 flex-1 cursor-pointer"
							onClick={() => setMainScreenAction("join")}
						>
							<p>Join a Room</p>

							{mainScreenAction === "join" && (
								<motion.div
									layoutId="bar"
									className="my-2 h-[5px] rounded-full bg-black/30"
								/>
							)}
						</div>

						<div
							className="my-2 flex-1 cursor-pointer"
							onClick={() => setMainScreenAction("create")}
						>
							<p>Create a Room</p>

							{mainScreenAction === "create" && (
								<motion.div
									layoutId="bar"
									className="my-2 h-[5px] rounded-full bg-black/30"
								/>
							)}
						</div>
					</div>

					<AnimatePresence>
						{mainScreenAction === "create" && (
							<motion.div
								layout="position"
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 50 }}
								transition={{ duration: 0.7, ease: "easeOut" }}
							>
								<CreateRoomSection
									disabled={clickedAlready}
									displayName={displayName}
									setDisplayName={setDisplayName}
								/>
							</motion.div>
						)}

						{mainScreenAction === "join" && (
							<motion.div
								layout="position"
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 50 }}
								transition={{ duration: 0.7, ease: "easeOut" }}
							>
								<JoinRoomSection
									disabled={clickedAlready}
									roomIDInput={roomIDInput}
									setRoomIDInput={setRoomIDInput}
									displayName={displayName}
									setDisplayName={setDisplayName}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<AccidentallyLeftGame
						onClose={() => setShowExistingGameModal(false)}
						onClickNo={() => {
							console.log("Intentional");
						}}
						onClickYes={joinBackExistingGame}
						show={showExistingGameModal}
						setShow={setShowExistingGameModal}
					/>

					<p className="mb-10 text-sm">
						By clicking &quot;Create Room&quot;, &quot;Join Room&quot; or
						&quot;Return to Game&quot;, you agree to the{" "}
						<Link href="/terms" className="text-red-600">
							Terms of Service
						</Link>{" "}
						and the{" "}
						<Link href="/privacy" className="text-red-600">
							Privacy Policy
						</Link>
						.
					</p>

					{/* Contains all the links to caution, terms of service, privacy and my github page */}

					{/* Versions */}
					<div className="my-10">
						<p className="text-sm">Version</p>

						<VersionSection />
					</div>

					<footer className="my-5 flex flex-wrap justify-center gap-2 text-xs">
						<div className="">
							<Link href="/caution" className="text-gray-500">
								Caution
							</Link>
						</div>

						<div className="">
							<Link href="/terms" className="text-gray-500">
								Terms of Service
							</Link>
						</div>

						<div className="">
							<Link href="/privacy" className="text-gray-500">
								Privacy Policy
							</Link>
						</div>

						<div className="">
							<Link href="/manual" className="text-gray-500">
								Game Manual
							</Link>
						</div>

						<div className="">
							<Link href="/changelog" className="text-gray-500">
								What&apos;s new?
							</Link>
						</div>

						<div className="">
							<Link
								className="text-gray-500"
								href={"https://github.nabilridhwan.com"}
							>
								Made with &lt;3 by Nabil
							</Link>
						</div>
					</footer>
				</div>
			</main>
		</div>
	);
}
