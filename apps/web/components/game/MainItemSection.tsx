import { IconArrowNarrowRight, IconDice } from "@tabler/icons";
import { Action, Log, Player, TRUTH_OR_DARE_GAME } from "@troof/socket";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { SocketProviderContext } from "../../context/SocketProvider";

interface MainItemSectionProps {
	player: Player;
	players: Player[];
	room_id: string;

	currentPlayer: Player;
	action: Action;
	text: string;

	setCurrentPlayer: (player: Player) => void;
	setAction: (action: Action) => void;
	setText: (text: string) => void;
}

const MainItemSection = ({
	room_id,
	player,
	currentPlayer,
	players,
	action,
	text,
	setCurrentPlayer,
	setAction,
	setText,
}: MainItemSectionProps) => {
	const [isLoadingState, setLoadingState] = useState<boolean>(false);
	const socket = useContext(SocketProviderContext);

	useEffect(() => {
		if (!socket) return;

		socket.on(TRUTH_OR_DARE_GAME.CONTINUE, (log: Log, player: Player) => {
			console.log("Continue game received");
			console.log(log, player);
			setCurrentPlayer(player);
			setText("");
			setAction(log.action as Action);

			setLoadingState(false);
		});

		socket.on(TRUTH_OR_DARE_GAME.INCOMING_DATA, (log: Log, player: Player) => {
			console.log("New data received");
			console.log(log, player);

			setText(log.data);
			setCurrentPlayer(player ?? {});
			setAction(
				(log.action as Action) ?? (Action.Waiting_For_Selection as Action)
			);

			setLoadingState(false);
		});
	}, [socket]);

	const selectTruth = () => {
		console.log("Selecting truth");
		console.log(!!socket);

		setLoadingState(true);
		if (!socket) return;
		console.log("Emitting to server to select truth");
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_TRUTH, {
			room_id: room_id,
		});
	};

	const selectDare = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_DARE, {
			room_id: room_id,
		});
	};

	const handleContinue = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_GAME.CONTINUE, {
			room_id: room_id,
		});
	};

	// Handling of re-rolling
	const handleReroll = () => {
		if (action === Action.Dare) {
			console.log("Re-rolling dare");
			selectDare();
			return;
		}

		console.log("Re-rolling dare");
		selectTruth();
	};

	return (
		<>
			{/* Main items */}
			<motion.div layout="position" className="relative my-2 flex-1">
				{/* Current Player Name */}
				<motion.main
					layout
					className="my-10 flex w-full items-center justify-center"
				>
					<motion.div
						className={`rnd bdr w-fit px-10 py-5 ${classNames({
							"animate-zoom":
								currentPlayer.player_id === player.player_id &&
								action === Action.Waiting_For_Selection,
						})}`}
					>
						<h1 className="break-all text-center font-Playfair text-5xl font-black">
							{currentPlayer.display_name}
						</h1>
					</motion.div>
				</motion.main>

				{/* Show this below if the current player is not the player and that the action is waiting for selection */}
				{currentPlayer.player_id !== player.player_id &&
					action === Action.Waiting_For_Selection && (
						<p className="text-center">
							Waiting for {currentPlayer.display_name} to select
						</p>
					)}

				{/* The truth/dare box*/}
				{action !== Action.Waiting_For_Selection && (
					<motion.div
						layout
						initial={{
							opacity: 0,
							y: -50,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						exit={{
							opacity: 0,
							y: 50,
						}}
						transition={{
							duration: 0.3,
						}}
					>
						<div className="rnd bdr mx-auto my-3 w-fit space-y-10 px-10 py-5">
							<p className="mb-5 text-center text-lg uppercase tracking-widest">
								{action}
							</p>

							{/* {text} */}
							<motion.div
								key={text}
								className="text-center text-xl font-bold leading-normal md:text-3xl"
							>
								{text &&
									text.split(" ").map((word, index) => (
										<motion.span
											className="mr-2 inline-block"
											key={index}
											initial={{
												opacity: 0,
												y: 50,
											}}
											animate={{
												opacity: 1,
												y: 0,
											}}
											transition={{
												delay: 0.2 + index * 0.05,
											}}
										>
											{word}
										</motion.span>
									))}
							</motion.div>

							{player.player_id === currentPlayer.player_id && (
								<motion.button
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: [0.9, 1.3, 0.9, 1],
									}}
									className="mx-auto flex w-fit items-center justify-center gap-1 rounded-lg bg-stone-700 py-1 px-2 text-sm text-white disabled:text-opacity-50"
									disabled={isLoadingState}
									onClick={handleReroll}
								>
									<motion.div
										key={text}
										animate={{
											rotate: 360,
										}}
									>
										<IconDice size={19} />
									</motion.div>
									Re-roll
								</motion.button>
							)}
						</div>
					</motion.div>
				)}

				{/* If it is the current player and the action is to wait for a selection, Show the selection truth or dare buttons */}
				{players.length >= 2 &&
					currentPlayer.player_id === player.player_id &&
					action === Action.Waiting_For_Selection && (
						<motion.div
							initial={{
								opacity: 0,
								y: -50,
							}}
							animate={{
								opacity: 1,
								y: 0,
							}}
							exit={{
								opacity: 0,
								y: 50,
							}}
							transition={{
								duration: 0.4,
								opacity: {
									duration: 0.2,
								},
							}}
						>
							<p className="text-center text-lg">Choose Your Fate</p>

							<div className="my-10 flex flex-wrap items-center justify-center gap-5">
								<motion.button
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: 0.9,
									}}
									className="btn-huge aspect-square w-[120px] disabled:text-opacity-50"
									disabled={isLoadingState}
									onClick={selectTruth}
								>
									Truth
								</motion.button>

								<motion.button
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: 0.9,
									}}
									className="btn-huge aspect-square w-[120px] disabled:text-opacity-50"
									disabled={isLoadingState}
									onClick={selectDare}
								>
									Dare
								</motion.button>
							</div>
						</motion.div>
					)}

				{players.length < 2 && (
					<>
						<p className="text-center italic">
							Waiting for more players to join. (Min. 2)
						</p>
					</>
				)}

				{/* If it is the current player and they're not waiting for selection */}
				{currentPlayer.player_id === player.player_id &&
					action !== Action.Waiting_For_Selection && (
						<div className="flex justify-center">
							<motion.button
								animate={{
									scale: 1.1,
								}}
								transition={{
									repeat: Infinity,
									repeatType: "mirror",
									duration: 1,
								}}
								className="t my-1 mt-2 flex items-center gap-2 rounded-xl bg-green-300 px-5 py-3 text-sm font-semibold text-green-900 disabled:text-opacity-50"
								onClick={handleContinue}
								disabled={isLoadingState}
							>
								Continue
								<motion.div
									initial={{ x: 0 }}
									animate={{
										x: 10,
									}}
									transition={{
										repeat: Infinity,
										repeatType: "mirror",
										duration: 1,
									}}
								>
									<IconArrowNarrowRight size={16} />
								</motion.div>
							</motion.button>
						</div>
					)}

				<div className="flex h-[50px] items-center justify-center">
					<PropagateLoader
						loading={isLoadingState}
						color={"black"}
						className="my-10 bg-red-500"
						size={10}
					/>
				</div>
			</motion.div>
		</>
	);
};

export default MainItemSection;
