import { IconArrowNarrowRight, IconDice, IconLink } from "@tabler/icons";
import {
	Action,
	EVENTS,
	Log,
	Player,
	Status,
	TRUTH_OR_DARE_GAME,
} from "@troof/socket";
import classNames from "classnames";
import { motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import Container from "../../components/Container";
import ChatBox from "../../components/message/ChatBox";
import EmojiReactionScreen from "../../components/message/EmojiReactionScreen";
import Players from "../../components/Players";
import {
	SocketProvider,
	SocketProviderContext,
} from "../../context/SocketProvider";
import getPlayer from "../../services/getPlayer";
import { Cookie } from "../../utils/Cookie";

export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	let { room_id } = context.query;

	let player_id = Cookie.getPlayerID(context.req, context.res);
	let roomIdFromCookie = Cookie.getRoomId(context.req, context.res);

	// if (roomIdFromCookie) {
	// 	room_id = roomIdFromCookie;

	// 	// Redirect to the game page
	// 	return {
	// 		redirect: {
	// 			destination: `/game/${room_id}`,
	// 			permanent: true,
	// 		},
	// 	};
	// }

	if (!player_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	let playerAPIData;

	try {
		// Find the player using the API
		playerAPIData = await getPlayer(player_id);
	} catch (error) {
		return {
			redirect: {
				destination: "/?error=player_not_found",
				permanent: false,
			},
		};
	}

	const player = playerAPIData.data.data;

	if (!player) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const rtnPlayer = {
		is_party_leader: player.is_party_leader,
		display_name: player.display_name,
		player_id: player.player_id,
	};

	return {
		props: {
			// Pass the query string to the page
			r: room_id,
			player_id,
			player: rtnPlayer,
		},
	};
}

type GamePageProps = Parameters<typeof GamePage>[0];

export default function GamePage({
	r: roomID,
	player_id,
	player,
}: {
	r: string;
	player_id: string;
	player: {
		is_party_leader: boolean;
		player_id: string;
		display_name: string;
	};
}) {
	return (
		<SocketProvider>
			<GamePageContent r={roomID} player_id={player_id} player={player} />
		</SocketProvider>
	);
}

function GamePageContent({ r: roomID, player_id, player }: GamePageProps) {
	const [room_id] = useState<string>(roomID);
	const [players, setPlayers] = useState<Player[]>([]);

	const [gameStatus, setGameStatus] = useState<string>("in_lobby");

	const [currentPlayer, setCurrentPlayer] = useState<Partial<Player>>({});
	const [action, setAction] = useState<Action>(Action.Waiting_For_Selection);
	const [text, setText] = useState<string>("");

	// This state below is for the Room code text. after copying, it will change to "Copied!"
	const [roomCodeText, setRoomCodeText] = useState<string>(`${room_id}`);

	// This state below is for the loading state, everytime a person clicks continue, it will be set to true
	const [isLoadingState, setLoadingState] = useState<boolean>(true);

	const socket = useContext(SocketProviderContext);

	useEffect(() => {
		localStorage.setItem("displayName", player.display_name);

		if (socket) {
			console.log("Emitting joined truth or dare game");

			socket.emit(TRUTH_OR_DARE_GAME.JOINED, {
				room_id: room_id,
				player_id: player_id,
			});

			socket.on(EVENTS.PLAYERS_UPDATE, (data) => {
				console.log(EVENTS.PLAYERS_UPDATE, " received");
				console.log(data);
				setPlayers(data);
			});

			socket.on(EVENTS.GAME_UPDATE, (data) => {
				console.log("Status change received");
				setGameStatus(data.status);
			});

			socket.on(
				TRUTH_OR_DARE_GAME.CONTINUE,
				(log: Log, player: Player) => {
					console.log("Continue game received");
					console.log(log, player);
					setCurrentPlayer(player);
					setText("");
					setAction(log.action as Action);

					setLoadingState(false);
				}
			);

			socket.on(
				TRUTH_OR_DARE_GAME.INCOMING_DATA,
				(log: Log, player: Player) => {
					console.log("New data received");
					console.log(log, player);

					setText(log.data);
					setCurrentPlayer(player ?? {});
					setAction(
						(log.action as Action) ??
							(Action.Waiting_For_Selection as Action)
					);

					setLoadingState(false);
				}
			);

			// Handles if the user successfully left the game
			socket.on(EVENTS.LEFT_GAME, (playerRemoved: Player) => {
				console.log(playerRemoved);
				if (playerRemoved.player_id === player.player_id) {
					console.log("Redirecting to home page");
					console.log("Left game");
					// Removing cookies
					Cookie.removePlayerID();
					window.location.href = "/";
				}

				// socket.disconnect();
			});

			socket.on("disconnect", () => {
				console.log("Disconnected");
				console.log("You are disconnected");

				setTimeout(() => {
					window.location.reload();
				}, 3000);

				// Refresh the page
				// window.location.reload();
				// Tell the server that they have been disconnected
				// socket.emit(EVENTS.DISCONNECTED, {
				// 	room_id: room_id,
				// 	player_id,
				// });
			});
		}
	}, [socket, room_id, player_id]);

	useEffect(() => {
		if (!socket) return;

		if (players.length >= 2) {
			setGameStatus(Status.In_Game);

			console.log("There are 2 or more players, starting game");
			socket.emit(EVENTS.START_GAME, {
				room_id,
			});
		} else {
			setGameStatus(Status.In_Lobby);
			setGameStatus(Status.In_Game);

			console.log(
				"There is less than 2 players, waiting for more. Changing status to in lobby"
			);
			socket.emit(EVENTS.GAME_UPDATE, {
				room_id,
				status: Status.In_Lobby,
			});
		}
	}, [players, room_id, socket]);

	const inLobbyGame = () => {
		if (!socket) return;
		socket.emit(EVENTS.GAME_UPDATE, {
			room_id: room_id,
			status: Status.In_Lobby,
		});
	};

	const selectTruth = () => {
		console.log("Selecting truth");
		console.log(!!socket);

		setLoadingState(true);
		if (!socket) return;
		console.log("Emitting to server to select truth");
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_TRUTH, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const selectDare = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_DARE, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const handleContinue = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_GAME.CONTINUE, {
			room_id: room_id,
		});
	};

	const handleLeaveGame = () => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_GAME.LEAVE_GAME, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const handleCopyRoomCode = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/join/${room_id}`
		);

		// Show Copied! for a second
		setRoomCodeText("Copied!");
		setTimeout(() => {
			setRoomCodeText(`${room_id}`);
		}, 1000);
	};

	return (
		<Container>
			<Head>
				<title>Game</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<EmojiReactionScreen room_id={room_id} />

			<div className="h-screen py-10 ">
				<div className="lg:grid lg:grid-cols-4 gap-10 h-full items-center justify-center">
					<div className="col-span-1 lg:h-full lg:border border-black/10 rounded-2xl px-1">
						<h2 className="font-bold text-lg my-5 text-center">
							Players
						</h2>
						<Players
							player={player}
							players={players}
							room_id={roomID}
						/>
					</div>

					<div className="col-span-2 lg:h-full lg:border border-black/10 rounded-2xl lg:px-10">
						<div className="w-full h-full flex items-center justify-center">
							{/* Main items */}
							<div className=" my-2 flex-1">
								{/* Room Code */}
								<motion.p
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className="font-mono font-bold text-sm text-center my-10 cursor-pointer"
									onClick={handleCopyRoomCode}
								>
									<span className="flex gap-1 w-fit items-center mx-auto bg-black text-white rounded-lg py-1 px-2">
										<IconLink size={16} />
										{roomCodeText}
									</span>
								</motion.p>

								{/* Current Player Name */}
								<main className="w-full flex items-center justify-center my-10">
									<motion.div
										className={`rnd bdr w-fit px-10 py-5 ${classNames(
											{
												"animate-zoom":
													currentPlayer.player_id ===
														player_id &&
													action ===
														Action.Waiting_For_Selection,
											}
										)}`}
									>
										<h1 className="font-Playfair font-black text-5xl text-center break-all">
											{currentPlayer.display_name}
										</h1>
									</motion.div>
								</main>

								{/* The truth/dare box*/}
								{action !== Action.Waiting_For_Selection && (
									<motion.div
										initial={{
											opacity: 0,
											y: -100,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											y: 100,
										}}
									>
										<div className="rnd bdr w-fit px-10 py-5 space-y-4 mx-auto my-3">
											<h2 className="text-center text-xl md:text-3xl font-semibold leading-normal">
												{text}
											</h2>

											{player_id ===
												currentPlayer.player_id && (
												<motion.button
													whileHover={{
														scale: 1.1,
													}}
													whileTap={{
														scale: 0.9,
													}}
													className="bg-black text-sm text-white rounded-lg py-1 px-2 flex w-fit justify-center items-center mx-auto gap-1 disabled:text-opacity-50"
													disabled={isLoadingState}
													onClick={
														action === Action.Dare
															? () => {
																	console.log(
																		"Re-rolling dare"
																	);
																	selectDare();
															  }
															: () => {
																	console.log(
																		"Re-rolling truth"
																	);
																	selectTruth();
															  }
													}
												>
													<motion.div
														initial={{
															opacity: 0,
														}}
														animate={{
															rotate: 360,
															opacity: 1,
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
									currentPlayer.player_id === player_id &&
									action === Action.Waiting_For_Selection && (
										<motion.div>
											<p className="text-center">
												Select One
											</p>

											<div className="flex flex-wrap items-center justify-center gap-5 my-10">
												<motion.button
													whileHover={{
														scale: 1.1,
														y: -10,
													}}
													whileTap={{
														scale: 0.9,
													}}
													className="btn-huge w-[120px] aspect-square disabled:text-opacity-50"
													disabled={isLoadingState}
													onClick={selectTruth}
												>
													Truth
												</motion.button>

												<motion.button
													whileHover={{
														scale: 1.1,
														y: -10,
													}}
													whileTap={{
														scale: 0.9,
													}}
													className="btn-huge w-[120px] aspect-square disabled:text-opacity-50"
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
											Waiting for more players to join.
											(Min. 2)
										</p>

										<motion.p
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="font-bold text-sm text-center my-10 cursor-pointer"
											onClick={handleCopyRoomCode}
										>
											<span className="bg-black text-white rounded-lg py-1 px-2 flex w-fit justify-center items-center mx-auto gap-1">
												<IconLink size={16} />
												Invite your friends
											</span>
										</motion.p>
									</>
								)}

								{/* Show this below if the current player is not the player and that the action is waiting for selection */}
								{currentPlayer.player_id !== player_id &&
									action === Action.Waiting_For_Selection && (
										<p className="text-center">
											Waiting for{" "}
											{currentPlayer.display_name} to
											select
										</p>
									)}

								{/* If it is the current player and they're not waiting for selection */}
								{currentPlayer.player_id === player_id &&
									action !== Action.Waiting_For_Selection && (
										<div className="flex justify-center">
											<motion.button
												whileTap={{
													scale: 0.9,
												}}
												initial={{ scale: 1 }}
												animate={{
													scale: 1.1,
												}}
												transition={{
													repeat: Infinity,
													repeatType: "mirror",
													duration: 1,
												}}
												className="px-5 py-3 rounded-xl mt-2 my-1 t bg-green-300 text-green-900 flex gap-2 items-center text-sm font-semibold disabled:text-opacity-50"
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
													<IconArrowNarrowRight
														size={16}
													/>
												</motion.div>
											</motion.button>
										</div>
									)}

								<div className="flex items-center justify-center h-[50px]">
									<PropagateLoader
										loading={isLoadingState}
										color={"black"}
										className="bg-red-500 my-10"
										size={10}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="col-span-1 lg:h-full">
						<ChatBox
							player_id={player_id}
							room_id={roomID}
							display_name={player.display_name}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
}
