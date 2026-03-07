/** @format */

import { Player, ROOM_EVENTS, RoomBootstrapState, Status } from "@troof/socket";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";
import { Cookie } from "../utils/Cookie";

interface UseGameRoomOptions {
	room_id: string;
	initialPlayer: Player;
	initialBootstrap: RoomBootstrapState;
}

export function useGameRoom({
	room_id,
	initialPlayer,
	initialBootstrap,
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

	useEffect(() => {
		localStorage.setItem("displayName", initialPlayer.display_name);

		if (!socket) return;
		let disconnectTimeout: ReturnType<typeof setTimeout> | null = null;

		const onPlayersUpdate = (data: Player[]) => {
			setPlayers(data);
			setHasReceivedPlayers(true);

			const updatedSelf = data.find(
				(playerData) => playerData.player_id === initialPlayer.player_id
			);

			if (updatedSelf) {
				setPlayer(updatedSelf);
			}
		};

		const onGameUpdate = (data: { status: string }) => {
			setGameStatus(data.status);
			setHasReceivedGameStatus(true);
		};

		const onLeftGame = (playerRemoved: Player) => {
			if (playerRemoved.player_id === initialPlayer.player_id) {
				Cookie.removePlayerID();
				Cookie.removeRoomId();
				Cookie.removeToken();
				window.location.href = "/";
			}
		};

		const onDisconnect = (reason: string) => {
			if (reason === "transport close") {
				disconnectTimeout = setTimeout(() => {
					window.location.reload();
				}, 1500);
				return;
			}

			disconnectTimeout = setTimeout(() => {
				window.location.reload();
			}, 2500);
		};

		socket.on(ROOM_EVENTS.PLAYERS_UPDATE, onPlayersUpdate);
		socket.on(ROOM_EVENTS.GAME_UPDATE, onGameUpdate);
		socket.on(ROOM_EVENTS.LEFT_GAME, onLeftGame);
		socket.on("disconnect", onDisconnect);

		socket.emit(ROOM_EVENTS.JOIN, { room_id });

		return () => {
			socket.off(ROOM_EVENTS.PLAYERS_UPDATE, onPlayersUpdate);
			socket.off(ROOM_EVENTS.GAME_UPDATE, onGameUpdate);
			socket.off(ROOM_EVENTS.LEFT_GAME, onLeftGame);
			socket.off("disconnect", onDisconnect);
			if (disconnectTimeout) clearTimeout(disconnectTimeout);
		};
	}, [socket, room_id, initialPlayer.player_id, initialPlayer.display_name]);

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
	};
}
