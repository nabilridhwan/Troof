import { motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "../../components/Container";
import ChatBox from "../../components/message/ChatBox";
import EmojiReactionScreen from "../../components/message/EmojiReactionScreen";
import Players from "../../components/Players";
import { useSocket } from "../../hooks/useSocket";
import {
	Action,
	EVENTS,
	Log,
	Player,
	Status,
	TRUTH_OR_DARE_GAME,
} from "../../Types";
import axiosInstance from "../../utils/axiosInstance";
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

	let playerFromAPI;

	try {
		// Find the player using the API
		playerFromAPI = await axiosInstance.get("/api/player", {
			params: {
				player_id,
			},
		});
	} catch (error) {
		return {
			redirect: {
				destination: "/?error=player_not_found",
				permanent: false,
			},
		};
	}

	const player = playerFromAPI.data.data;

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
	const [room_id] = useState<string>(roomID);
	const [players, setPlayers] = useState<Player[]>([]);

	const [gameStatus, setGameStatus] = useState<string>("in_lobby");

	const [currentPlayer, setCurrentPlayer] = useState<Partial<Player>>({});
	const [action, setAction] = useState<Action>(Action.Waiting_For_Selection);
	const [text, setText] = useState<string>("");

	// This state below is for the Room code text. after copying, it will change to "Copied!"
	const [roomCodeText, setRoomCodeText] = useState<string>(
		`Room Code: ${room_id}`
	);

	const { socket } = useSocket();

	useEffect(() => {
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
				}
			);

			// Handles if the user successfully left the game
			socket.on(EVENTS.LEFT_GAME, (playerRemoved: Player) => {
				console.log(playerRemoved);
				if (playerRemoved.player_id === player.player_id) {
					console.log("Left game");
					window.location.href = "/";
				}
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
		if (!socket) return;
		console.log("Emitting to server to select truth");
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_TRUTH, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const selectDare = () => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_DARE, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const handleContinue = () => {
		if (!socket) return;
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
			setRoomCodeText(`Room Code: ${room_id}`);
		}, 1000);
	};

	return (
		<>
			<Container>
				<Head>
					<title>Game</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<EmojiReactionScreen room_id={room_id} />

				<div className="my-5 lg:h-[93vh]">
					<div className="lg:grid lg:grid-cols-12 gap-10">
						<div className="col-span-9">
							<div className="w-full h-full flex items-center justify-center">
								{/* Main items */}
								<div className=" my-2 flex-1">
									{/* Room Code */}
									<motion.p
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className="font-bold text-sm text-center my-10 cursor-pointer"
										onClick={handleCopyRoomCode}
									>
										<span className="bg-black text-white rounded-lg py-1 px-2">
											{roomCodeText}
										</span>
									</motion.p>

									{/* Current Player Name */}
									<main className="w-full flex items-center justify-center my-10">
										<div className="rnd bdr w-fit px-10 py-5">
											<h1 className="font-Playfair font-black text-5xl text-center">
												{currentPlayer.display_name}
											</h1>
										</div>
									</main>

									{/* If it is the current player and the action is to wait for a selection, Show the selection truth or dare buttons */}
									{currentPlayer.player_id === player_id &&
										action ===
											Action.Waiting_For_Selection && (
											<>
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
														className="btn-huge w-[120px] aspect-square"
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
														className="btn-huge w-[120px] aspect-square"
														onClick={selectDare}
													>
														Dare
													</motion.button>
												</div>
											</>
										)}

									{/* Show this below if the current player is not the player and that the action is waiting for selection */}
									{currentPlayer.player_id !== player_id &&
										action ===
											Action.Waiting_For_Selection && (
											<p className="text-center">
												Waiting for{" "}
												{currentPlayer.display_name} to
												select
											</p>
										)}

									{/* The truth/dare text */}
									{action !==
										Action.Waiting_For_Selection && (
										<>
											<div className="rnd bdr w-fit px-10 py-5 space-y-4 mx-auto my-3">
												<h2 className="text-center text-3xl font-semibold">
													{text}
												</h2>
											</div>
										</>
									)}

									{/* If it is the current player and they're not waiting for selection */}
									{currentPlayer.player_id === player_id &&
										action !==
											Action.Waiting_For_Selection && (
											<div>
												<motion.button
													whileHover={{
														scale: 1.01,
													}}
													whileTap={{
														scale: 0.9,
													}}
													className="btn mt-2 my-1 t bg-green-400 text-black/80"
													onClick={handleContinue}
												>
													Continue
												</motion.button>
											</div>
										)}
								</div>
							</div>
						</div>

						<div className="col-span-3 h-full flex flex-col-reverse">
							<Players
								player={player}
								players={players}
								room_id={roomID}
							/>
							<ChatBox player_id={player_id} room_id={roomID} />
						</div>
					</div>
				</div>
			</Container>

			{/* Bottom items */}
			{/* <div className="fixed bottom-0 w-full">
				<div className="flex justify-between items-center bg-black/10 px-5 py-2">
					<div className="flex flex-col gap-3">
						<p className="text-sm font-bold">
							<span className="font-black bg-black font-Playfair text-white rounded-lg py-1 px-2">
								{player.display_name}
							</span>
						</p>
					</div>

					<div className="">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.9 }}
							className="btn my-1 bg-red-500 text-white border-none flex items-center gap-2 text-sm"
							onClick={handleLeaveGame}
						>
							<IconLogout size={16} />
							Leave
						</motion.button>
					</div>
				</div>
			</div> */}
		</>
	);
}
