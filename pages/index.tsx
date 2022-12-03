import { AnimatePresence, motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateRoomSection from "../components/home/CreateRoomSection";
import JoinRoomSection from "../components/home/JoinRoomSection";
import axiosInstance from "../utils/axiosInstance";

type MainScreenAction = "create" | "join" | "none";

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

	const [mainScreenAction, setMainScreenAction] =
		useState<MainScreenAction>("join");

	const handleJoinGameButtonClick = () => {
		if (roomIDInput.trim()) {
			// Redirect to the join page
			window.location.href = `/join/${roomIDInput}?display_name=${displayName}`;
		}
	};

	const handleCreateRoomButtonClick = () => {
		if (displayName.trim()) {
			// Redirect to the create page
			window.location.href = "/create?display_name=" + displayName;
		}
	};

	useEffect(() => {
		setRoomIDInput(room_id as string);
	}, [room_id]);

	useEffect(() => {
		setErrorMessage(error as string);
	}, [error]);

	return (
		<div>
			<Head>
				<title>Troof! - Synchronized Truth Or Dare game!</title>
				<meta
					name="description"
					content="Come play a synchronized truth or dare game with your friends!"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="text-center space-y-10 w-[90%] lg:w-[40%] mx-auto">
				<div>
					<motion.h1
						initial={{ opacity: 0, fontSize: 0, y: 1 }}
						animate={{
							opacity: 1,
							y: 0,
							fontSize: "7rem",
						}}
						transition={{
							duration: 0.8,
							ease: "easeInOut",
							delay: 0.1,
						}}
						className="my-14 font-black font-Playfair h-[150px] "
					>
						Troof!
					</motion.h1>

					<p className="font-bold text-sm text-center mb-6 mt-2 space-x-1">
						<span className="bg-black text-white rounded-lg py-1 px-2">
							<span className="text-xs">Game</span> v0.1.5
						</span>

						<span className="bg-black text-white rounded-lg py-1 px-2">
							<span className="text-xs">Server</span>{" "}
							{serverVersion}
						</span>
					</p>

					<p className="text-lg mb-5">
						Synchronized online Truth Or Dare game!
					</p>

					<p className="text-sm text-black/80">
						The truths and dares are 18+. By joining/creating a
						game,{" "}
						<span className="font-semibold">
							you&apos;re responsible for safe play.
						</span>
					</p>

					<p className="text-red-500">{errorMessage}</p>

					<div className="flex py-5 justify-around">
						<div
							className="w-full cursor-pointer my-2"
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
							className="w-full cursor-pointer my-2"
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
									roomIDInput={roomIDInput}
									setRoomIDInput={setRoomIDInput}
									displayName={displayName}
									setDisplayName={setDisplayName}
									handleOnClick={handleJoinGameButtonClick}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<p className="text-sm mb-10">
						Created by{" "}
						<a href="https://github.nabilridhwan.com">Nabil</a>
					</p>
				</div>
			</main>
		</div>
	);
}
