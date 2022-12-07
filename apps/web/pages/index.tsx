import { Player } from "@troof/socket";
import { AnimatePresence, motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CautionSection from "../components/home/CautionSection";
import CreateRoomSection from "../components/home/CreateRoomSection";
import ExistingGameSection from "../components/home/ExistingGameSection";
import JoinRoomSection from "../components/home/JoinRoomSection";
import pkgjson from "../package.json";
import getPlayer from "../services/getPlayer";
import getRoom from "../services/getRoom";
import axiosInstance from "../utils/axiosInstance";
import { Cookie } from "../utils/Cookie";

import { IconDeviceGamepad, IconServer } from "@tabler/icons";
import Image from "next/image";
import troofPromoImage from "../public/troof_promo_new_new.png";

type MainScreenAction = "create" | "join" | "existing_game" | "none";

export async function getServerSideProps(context: NextPageContext) {
	try {
		const res = await axiosInstance.get("/");

		const { version } = res.data.data;

		return {
			props: {
				serverVersion: `v${version}`,
			},
		};
	} catch (error) {
		return {
			props: {
				serverVersion: "Error",
			},
		};
	}
}

export default function Home({ serverVersion }: { serverVersion: string }) {
	const { query } = useRouter();

	const { room_id = "", error } = query;

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [roomIDInput, setRoomIDInput] = useState<string>(room_id as string);
	const [displayName, setDisplayName] = useState<string>("");

	const [showCautions, setShowCautions] = useState<boolean>(false);

	// This state changes when the person presses the "Join" or "Create" button
	const [clickedAlready, setClickedAlready] = useState<boolean>(false);

	const [mainScreenAction, setMainScreenAction] =
		useState<MainScreenAction>("join");

	const [existingGameExists, setExistingGameExists] =
		useState<boolean>(false);

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

	const getPlayerFromAPI = async (player_id: string) => {
		let playerAPIData;

		try {
			// Find the player using the API
			playerAPIData = await getPlayer(player_id);

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

	useEffect(() => {
		(async () => {
			const roomIDFromCookies = Cookie.getRoomId();
			const playerIDFromCookies = Cookie.getPlayerID();

			if (roomIDFromCookies && playerIDFromCookies) {
				console.log("Room ID and player ID found in cookies");
				// Get these data from API
				const playerPromise = getPlayerFromAPI(playerIDFromCookies);
				const roomPromise = getRoomFromAPI(roomIDFromCookies);

				await Promise.all([playerPromise, roomPromise]).then(
					(values) => {
						const [player, room] = values;
						console.log(
							"Player from API: ",
							!!player,
							"Room from API: ",
							!!room
						);

						if (player && room) {
							console.log("The room and player is still valid");
							setMainScreenAction("existing_game");
							setExistingGameExists(true);
							// Redirect to the game page
							// window.location.href = `/game/${roomIDFromCookies}`;
						}
					}
				);
			}
		})();
	}, []);

	return (
		<div>
			<Head>
				<title>
					Troof! - Experience the ultimate social truth or dare game -
					see, chat, and react together with your friends!
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

			<main className="text-center w-[90%] lg:w-[55%] mx-auto">
				<div>
					<div className="grid lg:grid-cols-2 my-10">
						<div className="lg:text-left">
							<motion.h1
								initial={{ opacity: 0, fontSize: 0, y: 1 }}
								animate={{
									opacity: 1,
									y: 0,
									fontSize: "6.5rem",
								}}
								transition={{
									duration: 0.8,
									ease: "easeInOut",
									delay: 0.1,
								}}
								className="my-10 font-black font-Playfair h-[150px] "
							>
								Troof!
							</motion.h1>

							<p className="text-lg mb-5">
								Experience the ultimate social truth or dare
								game - see, chat, and react together with your
								friends!
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
								quality={100}
								height={900}
								src={troofPromoImage}
								alt="Troof promo image"
							/>
						</div>
					</div>

					{showCautions && (
						<CautionSection
							onClose={() => setShowCautions(false)}
						/>
					)}

					<p className="text-red-500">{errorMessage}</p>

					{/* Only show this section when main screen action is not "existing_game" */}

					<div className="flex py-5 justify-around flex-wrap">
						<div
							className="flex-1 cursor-pointer my-2"
							onClick={() => setMainScreenAction("join")}
						>
							<p>Join a Room</p>

							{mainScreenAction === "join" && (
								<motion.div
									layoutId="bar"
									className="bg-black/30 h-[5px] rounded-full my-2"
								/>
							)}
						</div>

						<div
							className="flex-1 cursor-pointer my-2"
							onClick={() => setMainScreenAction("create")}
						>
							<p>Create a Room</p>

							{mainScreenAction === "create" && (
								<motion.div
									layoutId="bar"
									className="bg-black/30 h-[5px] rounded-full my-2"
								/>
							)}
						</div>

						{existingGameExists && (
							<div
								className="flex-1 cursor-pointer my-2"
								onClick={() =>
									setMainScreenAction("existing_game")
								}
							>
								<p>Existing Game</p>

								<motion.div
									layoutId="bar"
									className="bg-black/30 h-[5px] rounded-full my-2"
								/>
							</div>
						)}
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
									handleOnClick={handleCreateRoomButtonClick}
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
									handleOnClick={handleJoinGameButtonClick}
								/>
							</motion.div>
						)}

						{mainScreenAction === "existing_game" && (
							<ExistingGameSection
								onClose={() => setMainScreenAction("join")}
							/>
						)}
					</AnimatePresence>

					<p className="mb-10 text-sm">
						By clicking &quot;Create Room&quot;, &quot;Join
						Room&quot; or &quot;Return to Game&quot;, you agree to
						the{" "}
						<Link href="/terms" className="text-red-600">
							Terms of Service
						</Link>{" "}
						and the{" "}
						<Link href="/privacy" className="text-red-600">
							Privacy Policy
						</Link>
						.
					</p>

					{/* <p className="text-sm mb-2">
						Created by{" "}
						<Link
							className="text-red-600"
							href={"https://github.nabilridhwan.com"}
						>
							Nabil
						</Link>
					</p> */}

					{/* <button className="bg-lime-100 text-lime-900 rounded-lg px-4 py-2 my-4 text-xs mb-10 border border-lime-900/20">
						<Link href={"/changelog"} className="no-underline">
							Read what&apos;s new in v{pkgjson.version}
						</Link>
					</button> */}

					{/* Contains all the links to caution, terms of service, privacy and my github page */}

					{/* Versions */}

					<div className="my-10">
						<p className="text-sm">Version</p>
						<p className="font-semibold text-xs text-center  mb-6 mt-2 space-x-1.5 flex justify-center">
							<span
								title="Game Version"
								className="flex bg-gray-800 text-gray-200 rounded-lg py-1 px-2 gap-1 items-center"
							>
								<span className="text-xs">
									<IconDeviceGamepad size={20} />
								</span>{" "}
								v{pkgjson.version}
							</span>

							<span
								title="Server Version"
								className="flex bg-gray-800 text-gray-200 rounded-lg py-1 px-2 gap-1 items-center"
							>
								<span className="text-xs">
									<IconServer size={20} />
								</span>{" "}
								{serverVersion}
							</span>
						</p>
					</div>

					<footer className="flex flex-wrap my-5 text-xs gap-2 justify-center">
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
