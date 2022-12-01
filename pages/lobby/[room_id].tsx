import { IconCrown } from "@tabler/icons";
import cx from "classnames";
import { motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { EVENTS, Room, Status } from "../../Types";
import { Cookie } from "../../utils/Cookie";

export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id } = context.query;

	const player_id = Cookie.getPlayerID(context.req, context.res);

	if (!player_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			room_id,
			player_id,
		},
	};
}

export default function GamePage({
	room_id: roomID,
	player_id,
}: {
	room_id: string;
	player_id: string;
	isPartyLeader: boolean;
}) {
	const [room_id] = useState<string>(roomID);
	const [players, setPlayers] = useState<any[]>([]);
	const [gameStatus, setGameStatus] = useState<string>("in_lobby");
	const [isPartyLeader, setIsPartyLeader] = useState<boolean>(false);

	const { socket } = useSocket();

	console.log(player_id);

	useEffect(() => {
		if (players && players.length > 0) {
			const filteredPartyLeaderPlayerID = players.filter(
				(player) => player.is_party_leader
			)[0].player_id;

			setIsPartyLeader(filteredPartyLeaderPlayerID === player_id);
		}
	}, [players, player_id]);

	useEffect(() => {
		console.log(socket);
		if (socket) {
			console.log("Emitting join_room");

			socket.emit(EVENTS.JOIN_ROOM, {
				room_id: room_id,
			});

			socket.on(EVENTS.PLAYERS_UPDATE, (data) => {
				console.log(EVENTS.PLAYERS_UPDATE, " received");
				setPlayers(data);
			});

			socket.on(EVENTS.GAME_UPDATE, (data: Room) => {
				console.log("Status change received");
				setGameStatus(data.status);
			});

			socket.on("disconnect", () => {
				console.log("Disconnected");
				// Tell the server that they have been disconnected
				socket.emit(EVENTS.DISCONNECTED, {
					room_id: room_id,
					player_id,
				});
			});
		}
	}, [socket, room_id, player_id]);

	useEffect(() => {
		if (gameStatus === Status.In_Game) {
			window.location.href = `/game/${room_id}`;
		}
	}, [gameStatus, room_id]);

	useEffect(() => {
		return () => {
			if (socket) {
				console.log("Leaving room");
				// Tell the server that they have been disconnected
				socket.emit(EVENTS.DISCONNECTED, {
					room_id: room_id,
					player_id,
				});
			}
		};
	}, [player_id, room_id, socket]);

	const setGameToStart = () => {
		if (!socket) return;

		socket.emit(EVENTS.START_GAME, {
			room_id: room_id,
		});
	};

	const setGameToStop = () => {
		if (!socket) return;
		socket.emit(EVENTS.GAME_UPDATE, {
			room_id: room_id,
			status: Status.In_Lobby,
		});
	};

	return (
		<div>
			<Head>
				<title>Troof! - {room_id}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="h-screen flex items-center justify-center">
				<div className="grid grid-cols-1 md:grid-cols-2 mx-20 gap-5 w-[1000px] h-max">
					<div id="room-code-region" className="h-max bdr rnd p-5">
						<h1>Room Code:</h1>

						<div className="bdr rnd h-full my-5 py-20 flex items-center justify-center">
							<h1 className="font-Poppins font-black text-5xl">
								{room_id}
							</h1>
						</div>
					</div>

					<div id="right-region" className="bdr rnd p-5 space-y-6">
						<h1>Players ({players.length})</h1>

						<div className="rnd bdr px-4 py-2">
							{players &&
								players.map((player: any) => (
									<div
										key={player.player_id}
										className={`flex my-3 ${cx({
											"font-bold":
												player.player_id === player_id,
										})}`}
									>
										{player.display_name}

										{player.is_party_leader && (
											<IconCrown className="mx-1 text-yellow-500" />
										)}
									</div>
								))}
						</div>

						{isPartyLeader && (
							<>
								<motion.button
									className="btn"
									onClick={setGameToStart}
									disabled={
										gameStatus !== Status.In_Lobby ||
										players.length < 2
									}
								>
									Start Game
								</motion.button>

								{/* <button
									className="btn"
									onClick={setGameToStop}
									disabled={gameStatus !== STATUS.IN_PROGRESS}
								>
									Stop Game
								</button> */}
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
