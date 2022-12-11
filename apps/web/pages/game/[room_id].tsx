/** @format */

import { IconArrowNarrowRight, IconDice } from "@tabler/icons";
import { getPlayer } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import {
	Action,
	EVENTS,
	Log,
	Player,
	SECURITY_EVENTS,
	Status,
	TRUTH_OR_DARE_GAME,
} from "@troof/socket";
import { AxiosError, isAxiosError } from "axios";
import classNames from "classnames";
import { motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import Container from "../../components/Container";
import RoomCodeSection from "../../components/game/RoomCodeSection";
import ChatBox from "../../components/message/ChatBox";
import EmojiReactionScreen from "../../components/message/EmojiReactionScreen";
import Players from "../../components/Players";
import {
	PublicKeyProvider,
	PublicKeyProviderContext,
	UsePublicKeyType,
} from "../../context/PublicKeyProvider";
import {
	SocketProvider,
	SocketProviderContext,
} from "../../context/SocketProvider";
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
						permanent: false,
					},
				};
			}

			let {
				data: { message },
			} = e.response;
			return {
				redirect: {
					destination: `/?error=${message}`,
					permanent: false,
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

	const player = playerAPIData.data.data;

	if (!player) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
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
}

type GamePageProps = Parameters<typeof GamePage>[0];

export default function GamePage({
	r: roomID,
	player,
}: {
	r: string;
	player: Player;
}) {
	return (
		<PublicKeyProvider>
			<SocketProvider>
				<GamePageContent r={roomID} player={player} />
			</SocketProvider>
		</PublicKeyProvider>
	);
}

function GamePageContent({ r: roomID, player: p }: GamePageProps) {
	const [room_id] = useState<string>(roomID);
	const [players, setPlayers] = useState<Player[]>([]);

	const { publicKey, setPublicKey } = useContext(
		PublicKeyProviderContext
	) as UsePublicKeyType;

	const [player, setPlayer] = useState<Player>(p);

	const [gameStatus, setGameStatus] = useState<string>("in_lobby");

	const [currentPlayer, setCurrentPlayer] = useState<Partial<Player>>({});
	const [action, setAction] = useState<Action>(Action.Waiting_For_Selection);
	const [text, setText] = useState<string>("");

	const [isLoadingState, setLoadingState] = useState<boolean>(true);

	const socket = useContext(SocketProviderContext);

	useEffect(() => {
		localStorage.setItem("displayName", player.display_name);

		if (socket) {
			console.log("Emitting joined truth or dare game");

			socket.emit(TRUTH_OR_DARE_GAME.JOINED, {
				room_id: room_id,
				player_id: player.player_id,
			});

			socket.on(EVENTS.PLAYERS_UPDATE, (data) => {
				console.log(EVENTS.PLAYERS_UPDATE, " received");
				console.log(data);
				setPlayers(data);

				socket.emit(EVENTS.SELF_INFO, {
					player_id: player.player_id,
				});
			});

			socket.on(EVENTS.GAME_UPDATE, (data) => {
				console.log("Status change received");
				setGameStatus(data.status);
			});

			socket.on(TRUTH_OR_DARE_GAME.CONTINUE, (log: Log, player: Player) => {
				console.log("Continue game received");
				console.log(log, player);
				setCurrentPlayer(player);
				setText("");
				setAction(log.action as Action);

				setLoadingState(false);
			});

			socket.on(
				TRUTH_OR_DARE_GAME.INCOMING_DATA,
				(log: Log, player: Player) => {
					console.log("New data received");
					console.log(log, player);

					setText(log.data);
					setCurrentPlayer(player ?? {});
					setAction(
						(log.action as Action) ?? (Action.Waiting_For_Selection as Action)
					);

					setLoadingState(false);
				}
			);

			socket.on(SECURITY_EVENTS.PUBLIC_KEY, (publicKey: string) => {
				setPublicKey(publicKey);
				console.log("Set public key in game page");
			});

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

			socket.on(EVENTS.SELF_INFO, (player: Player) => {
				console.log("Self info received");
				console.log(player);
				setPlayer(player);
			});

			socket.on("disconnect", (reason) => {
				console.log(reason);
				console.log("Disconnected");
				console.log("You are disconnected");

				if (reason === "transport close") {
					setTimeout(() => {
						window.location.reload();
					}, 1500);

					return;
				}

				setTimeout(() => {
					window.location.reload();
				}, 2500);

				return;

				// Refresh the page
				// window.location.reload();
				// Tell the server that they have been disconnected
				// socket.emit(EVENTS.DISCONNECTED, {
				// 	room_id: room_id,
				// 	player_id,
				// });
			});
		}
	}, [socket, room_id, player.player_id]);

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
			player_id: player.player_id,
		});
	};

	const selectDare = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_GAME.SELECT_DARE, {
			room_id: room_id,
			player_id: player.player_id,
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
			player_id: player.player_id,
		});
	};

	return (
		<Container>
			<Head>
				<title>Game</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<EmojiReactionScreen room_id={room_id} />

			<div className="h-screen py-10 ">
				<div className="h-full items-center justify-center gap-10 lg:grid lg:grid-cols-4">
					<div className="col-span-1 rounded-2xl border-black/10 px-1 lg:h-full lg:border">
						{players.length < 8 && (
							<div className="m-2 mb-6 rounded-xl border border-black/25 bg-white/30">
								<RoomCodeSection room_id={roomID} />
							</div>
						)}

						<div>
							<h2 className={`my-5 text-center text-lg font-bold`}>
								Players ({players.length}/8)
							</h2>
							<Players
								player={player}
								players={players}
								room_id={roomID}
								currentPlayer={currentPlayer}
							/>
						</div>
					</div>

					<div className="col-span-2 rounded-2xl border-black/10 lg:h-full lg:border lg:px-10">
						<div className="flex h-full w-full items-center justify-center">
							{/* Main items */}
							<div className=" my-2 flex-1">
								{/* Current Player Name */}
								<main className="my-10 flex w-full items-center justify-center">
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
										<div className="rnd bdr mx-auto my-3 w-fit space-y-10 px-10 py-5">
											<p className="mb-5 text-center text-lg uppercase tracking-widest">
												{action}
											</p>

											<h2 className="text-center text-xl font-semibold leading-normal md:text-3xl">
												{text}
											</h2>

											{player.player_id === currentPlayer.player_id && (
												<motion.button
													whileHover={{
														scale: 1.1,
													}}
													whileTap={{
														scale: 0.9,
													}}
													className="mx-auto flex w-fit items-center justify-center gap-1 rounded-lg bg-black py-1 px-2 text-sm text-white disabled:text-opacity-50"
													disabled={isLoadingState}
													onClick={
														action === Action.Dare
															? () => {
																	console.log("Re-rolling dare");
																	selectDare();
															  }
															: () => {
																	console.log("Re-rolling truth");
																	selectTruth();
															  }
													}
												>
													<motion.div
														key={Math.random()}
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
										<motion.div>
											<p className="text-center">Select One</p>

											<div className="my-10 flex flex-wrap items-center justify-center gap-5">
												<motion.button
													whileHover={{
														scale: 1.1,
														y: -10,
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
														y: -10,
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

								{/* Show this below if the current player is not the player and that the action is waiting for selection */}
								{currentPlayer.player_id !== player.player_id &&
									action === Action.Waiting_For_Selection && (
										<p className="text-center">
											Waiting for {currentPlayer.display_name} to select
										</p>
									)}

								{/* If it is the current player and they're not waiting for selection */}
								{currentPlayer.player_id === player.player_id &&
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
							</div>
						</div>
					</div>

					<div className="col-span-1 py-5 lg:h-full lg:py-0">
						<ChatBox
							player_id={player.player_id}
							room_id={roomID}
							display_name={player.display_name}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
}
