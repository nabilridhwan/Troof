import { AnimateSharedLayout, motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
	const [roomIDInput, setRoomIDInput] = useState<string>("");
	const [displayName, setDisplayName] = useState<string>("");

	const [mainScreenAction, setMainScreenAction] = useState<
		"create" | "join" | "none"
	>("none");

	const joinGame = () => {
		if (roomIDInput.trim()) {
			// Redirect to the join page
			window.location.href = `/join/${roomIDInput}?display_name=${displayName}`;
		}
	};

	const createNewRoom = () => {
		// Redirect to the create page
		window.location.href = "/create?display_name=" + displayName;
	};

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

			<main className="w-screen h-screen text-center space-y-10 flex items-center justify-center">
				<div>
					<motion.h1
						initial={{ opacity: 0, fontSize: 0 }}
						animate={{ opacity: 1, y: 0, fontSize: "7rem" }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="mb-7 font-black font-Playfair"
					>
						Troof!
					</motion.h1>
					<p>Synchronized online Truth Or Dare game!</p>

					<AnimateSharedLayout>
						{mainScreenAction === "none" && (
							<>
								<motion.button
									whileHover={{
										scale: 1.1,
										transition: {
											ease: "easeOut",
										},
									}}
									whileTap={{
										scale: 0.9,
										transition: {
											ease: "easeOut",
										},
									}}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.2,
										},
									}}
									className="btn-huge m-10"
									onClick={() =>
										setMainScreenAction("create")
									}
								>
									Create a Room
								</motion.button>

								<motion.button
									whileHover={{
										scale: 1.1,
										transition: {
											ease: "easeOut",
										},
									}}
									whileTap={{
										scale: 0.9,
										transition: {
											ease: "easeOut",
										},
									}}
									className="btn-huge m-10"
									onClick={() => setMainScreenAction("join")}
								>
									Join a Room
								</motion.button>
							</>
						)}

						{mainScreenAction === "create" && (
							<>
								<motion.input
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									type="text"
									placeholder="Display Name"
									className="input-huge my-10 text-center"
									value={displayName}
									onChange={(e) =>
										setDisplayName(e.target.value)
									}
								/>

								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									whileHover={{
										scale: 1.1,
										transition: {
											ease: "easeOut",
										},
									}}
									whileTap={{
										scale: 0.9,
										transition: {
											ease: "easeOut",
										},
									}}
									className="btn-huge m-10"
									onClick={createNewRoom}
								>
									Create Room
								</motion.button>
							</>
						)}

						{mainScreenAction === "join" && (
							<>
								<motion.input
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									type="text"
									placeholder="Room ID"
									className="input-huge my-10 text-center"
									value={roomIDInput}
									onChange={(e) =>
										setRoomIDInput(e.target.value)
									}
								/>

								<motion.input
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									type="text"
									placeholder="Display Name"
									className="input-huge my-10 text-center"
									value={displayName}
									onChange={(e) =>
										setDisplayName(e.target.value)
									}
								/>

								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									whileHover={{
										scale: 1.1,
										transition: {
											ease: "easeOut",
										},
									}}
									whileTap={{
										scale: 0.9,
										transition: {
											ease: "easeOut",
										},
									}}
									className="btn-huge m-10"
									onClick={joinGame}
								>
									Join Room
								</motion.button>
							</>
						)}
					</AnimateSharedLayout>

					{/* <input
					type={"text"}
					placeholder="Room ID"
					value={roomIDInput}
					onChange={(e) => setRoomIDInput(e.target.value)}
				/>

				<input
					type={"text"}
					placeholder="Display Name"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
				/>

				<button disabled={!!roomIDInput} onClick={createNewRoom}>
					Create Room
				</button>
				<button onClick={joinGame}>Join Room</button> */}
					{/* <button onClick={giveTruth}>Truth</button> */}
					{/* <button onClick={giveDare}>Dare</button> */}
				</div>
			</main>
		</div>
	);
}
