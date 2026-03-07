/** @format */

import {
	Player,
	ROOM_EVENTS,
	RoomBootstrapState,
	SECURITY_EVENTS,
	Status,
	TRUTH_OR_DARE_EVENTS,
} from "@troof/socket";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";
import { Cookie } from "../utils/Cookie";

interface UseGameRoomOptions {
	room_id: string;
	initialPlayer: Player;
	initialBootstrap: RoomBootstrapState;
	setPublicKey: (publicKey: string) => void;
}

export function useGameRoom({
	room_id,
	initialPlayer,
	initialBootstrap,
	setPublicKey,
}: UseGameRoomOptions) {
	const socket = useContext(SocketProviderContext);

	const [players, setPlayers] = useState<Player[]>(
		initialBootstrap.players ?? []
	);
	const [player, setPlayer] = useState<Player>(
		initialBootstrap.self ?? initialPlayer
	);
	const [gameStatus, setGameStatus] = useState<string>(
		initialBootstrap.room?.status ?? "in_lobby"
	);

	const [hasReceivedPlayers, setHasReceivedPlayers] = useState<boolean>(
		(initialBootstrap.players?.length ?? 0) > 0
	);
	const [hasReceivedGameStatus, setHasReceivedGameStatus] = useState<boolean>(
		!!initialBootstrap.room?.status
	);
	const [hasReceivedPublicKey, setHasReceivedPublicKey] = useState<boolean>(
		!!initialBootstrap.public_key
	);

	useEffect(() => {
		localStorage.setItem("displayName", initialPlayer.display_name);

		if (initialBootstrap.public_key) {
			setPublicKey(initialBootstrap.public_key);
		}

		if (!socket) return;

		socket.emit(TRUTH_OR_DARE_EVENTS.JOINED, { room_id });
		socket.emit(ROOM_EVENTS.SELF_INFO, { player_id: initialPlayer.player_id });

		socket.on(ROOM_EVENTS.PLAYERS_UPDATE, (data) => {
			setPlayers(data);
			setHasReceivedPlayers(true);
			socket.emit(ROOM_EVENTS.SELF_INFO, {
				player_id: initialPlayer.player_id,
			});
		});

		socket.on(ROOM_EVENTS.GAME_UPDATE, (data) => {
			setGameStatus(data.status);
			setHasReceivedGameStatus(true);
		});

		socket.on(SECURITY_EVENTS.PUBLIC_KEY, (publicKey: string) => {
			setPublicKey(publicKey);
			setHasReceivedPublicKey(true);
		});

		socket.on(ROOM_EVENTS.LEFT_GAME, (playerRemoved: Player) => {
			if (playerRemoved.player_id === initialPlayer.player_id) {
				Cookie.removePlayerID();
				Cookie.removeRoomId();
				Cookie.removeToken();
				window.location.href = "/";
			}
		});

		socket.on(ROOM_EVENTS.SELF_INFO, (updatedPlayer: Player) => {
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
	}, [
		socket,
		room_id,
		initialBootstrap.public_key,
		initialPlayer.player_id,
		initialPlayer.display_name,
		setPublicKey,
	]);

	useEffect(() => {
		if (!socket) return;

		if (players.length >= 2) {
			socket.emit(ROOM_EVENTS.START_GAME, { room_id });
		} else {
			socket.emit(ROOM_EVENTS.GAME_UPDATE, {
				room_id,
				status: Status.In_Lobby,
			});
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
