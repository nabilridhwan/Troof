/** @format */

import {
	EVENTS,
	Player,
	SECURITY_EVENTS,
	Status,
	TRUTH_OR_DARE_GAME,
} from "@troof/socket";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";
import { Cookie } from "../utils/Cookie";

interface UseGameRoomOptions {
	room_id: string;
	initialPlayer: Player;
	setPublicKey: (publicKey: string) => void;
}

export function useGameRoom({
	room_id,
	initialPlayer,
	setPublicKey,
}: UseGameRoomOptions) {
	const socket = useContext(SocketProviderContext);

	const [players, setPlayers] = useState<Player[]>([]);
	const [player, setPlayer] = useState<Player>(initialPlayer);
	const [gameStatus, setGameStatus] = useState<string>("in_lobby");

	const [hasReceivedPlayers, setHasReceivedPlayers] = useState<boolean>(false);
	const [hasReceivedGameStatus, setHasReceivedGameStatus] =
		useState<boolean>(false);
	const [hasReceivedPublicKey, setHasReceivedPublicKey] =
		useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("displayName", initialPlayer.display_name);

		if (!socket) return;

		socket.emit(TRUTH_OR_DARE_GAME.JOINED, { room_id });

		socket.on(EVENTS.PLAYERS_UPDATE, (data) => {
			setPlayers(data);
			setHasReceivedPlayers(true);
			socket.emit(EVENTS.SELF_INFO, { player_id: initialPlayer.player_id });
		});

		socket.on(EVENTS.GAME_UPDATE, (data) => {
			setGameStatus(data.status);
			setHasReceivedGameStatus(true);
		});

		socket.on(SECURITY_EVENTS.PUBLIC_KEY, (publicKey: string) => {
			setPublicKey(publicKey);
			setHasReceivedPublicKey(true);
		});

		socket.on(EVENTS.LEFT_GAME, (playerRemoved: Player) => {
			if (playerRemoved.player_id === initialPlayer.player_id) {
				Cookie.removePlayerID();
				Cookie.removeRoomId();
				Cookie.removeToken();
				window.location.href = "/";
			}
		});

		socket.on(EVENTS.SELF_INFO, (updatedPlayer: Player) => {
			setPlayer(updatedPlayer);
		});

		socket.on("disconnect", (reason) => {
			if (reason === "transport close") {
				setTimeout(() => {
					window.location.reload();
				}, 1500);
				return;
			}

			setTimeout(() => {
				window.location.reload();
			}, 2500);
		});
	}, [socket, room_id, initialPlayer.player_id, initialPlayer.display_name, setPublicKey]);

	useEffect(() => {
		if (!socket) return;

		if (players.length >= 2) {
			setGameStatus(Status.In_Game);
			socket.emit(EVENTS.START_GAME, { room_id });
		} else {
			setGameStatus(Status.In_Lobby);
			setGameStatus(Status.In_Game);
			socket.emit(EVENTS.GAME_UPDATE, { room_id, status: Status.In_Lobby });
		}
	}, [players, room_id, socket]);

	return {
		players,
		player,
		gameStatus,
		hasReceivedPlayers,
		hasReceivedGameStatus,
		hasReceivedPublicKey,
	};
}
