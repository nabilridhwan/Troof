import { IconArrowNarrowRight, IconDice } from "@tabler/icons";
import { Action } from "@troof/socket";
import classNames from "classnames";
import { motion } from "framer-motion";
import { PropagateLoader } from "react-spinners";
import { useRoomContext } from "../../context/RoomContext";
import { useTruthOrDare } from "../../hooks/useTruthOrDare";

const MainItemSection = () => {
	const { room_id, player, players, bootstrap } = useRoomContext();

	const initialAction =
		(bootstrap.latest_log?.action as Action) ?? Action.Waiting_For_Selection;
	const initialText = bootstrap.latest_log?.data ?? "";
	const initialCurrentPlayer = bootstrap.current_player ?? null;

	const {
		isLoadingState,
		currentPlayer,
		text,
		action,
		selectTruth,
		selectDare,
		handleContinue,
	} = useTruthOrDare({
		room_id,
		initialCurrentPlayer,
		initialText,
		initialAction,
	});

	const handleReroll = () => {
		if (action === Action.Dare) {
			selectDare();
		} else {
			selectTruth();
		}
	};

	const isCurrentPlayerTurn = currentPlayer?.player_id === player.player_id;

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
								isCurrentPlayerTurn && action === Action.Waiting_For_Selection,
						})}`}
					>
						<h1 className="break-all text-center font-Playfair text-5xl font-black">
							{currentPlayer?.display_name ?? "Waiting..."}
						</h1>
					</motion.div>
				</motion.main>

				<p>{JSON.stringify(currentPlayer, null, 2)}</p>

				{/* Show this below if the current player is not the player and that the action is waiting for selection */}
				{!isCurrentPlayerTurn && action === Action.Waiting_For_Selection && (
					<p className="text-center">
						Waiting for {currentPlayer?.display_name ?? "a player"} to select
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
												opacity: 0.2 + index * 0.05,
											}}
										>
											{word}
										</motion.span>
									))}
							</motion.div>

							{isCurrentPlayerTurn && (
								<motion.button
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: [0.9, 1.3, 0.9, 1],
									}}
									className="mx-auto flex w-fit items-center justify-center gap-1 rounded-lg bg-stone-700 px-2 py-1 text-sm text-white disabled:text-opacity-50"
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
					isCurrentPlayerTurn &&
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
				{isCurrentPlayerTurn && action !== Action.Waiting_For_Selection && (
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
