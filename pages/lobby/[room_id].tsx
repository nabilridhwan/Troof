import { IconCrown, IconUserPlus } from "@tabler/icons";
import cx from "classnames";
import { motion } from "framer-motion";
import { NextPageContext } from "next";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import Container from "../../components/Container";
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

	const [inviteButtonText, setInviteButtonText] = useState<ReactNode>(
		<>
			<IconUserPlus />
			<span>Invite Players</span>
		</>
	);

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

	const handleCopyRoomCode = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/join/${room_id}`
		);

		// Show Copied! for a second
		setInviteButtonText(
			<>
				<p>Copied!</p>
			</>
		);
		setTimeout(() => {
			setInviteButtonText(
				<>
					<IconUserPlus />
					<span>Invite Players</span>
				</>
			);
		}, 1000);
	};

	return (
		<div>
			<Head>
				<title>Troof! - {room_id}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Container>
				<main className="h-screen flex flex-col items-center justify-center">
					<h1>Room Code:</h1>
					<div className="bdr rnd h-fit my-5 py-7 px-6 flex items-center justify-center">
						<h1 className="font-Poppins font-black text-6xl">
							{room_id}
						</h1>
					</div>

					{!isPartyLeader && (
						<p className="my-5 italic text-black/50 text-center">
							Waiting for party leader to start the game...
						</p>
					)}

					<motion.button
						onClick={handleCopyRoomCode}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						className="flex gap-2 w-fit px-2 py-3 bg-black/10 rounded-xl my-2"
					>
						{inviteButtonText}
					</motion.button>

					<div className="flex gap-2">
						{players &&
							players.map((player: any) => (
								<div
									key={player.player_id}
									className={`rnd bdr px-3 py-2 flex my-3 ${cx(
										{
											"font-bold":
												player.player_id === player_id,
										}
									)}`}
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
								className="btn mt-48"
								onClick={setGameToStart}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.9 }}
								disabled={
									gameStatus !== Status.In_Lobby ||
									players.length < 2
								}
							>
								Start Game
							</motion.button>
						</>
					)}
				</main>
			</Container>
		</div>
	);
}
