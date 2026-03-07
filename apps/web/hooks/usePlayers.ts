/** @format */

import { ROOM_EVENTS, TRUTH_OR_DARE_EVENTS } from "@troof/socket";
import { useContext } from "react";
import { SocketProviderContext } from "../context/SocketProvider";

interface UsePlayersOptions {
	room_id: string;
	player_id: string;
	display_name: string;
	newName: string;
}

export function usePlayers({
	room_id,
	player_id,
	display_name,
	newName,
}: UsePlayersOptions) {
	const socket = useContext(SocketProviderContext);

	const removePlayer = (target_player_id: string) => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_EVENTS.LEAVE_GAME, {
			room_id,
			player_id: target_player_id,
		});
	};

	const handleContinue = () => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_EVENTS.CONTINUE, { room_id });
	};

	const transferPartyLeader = (transferToPlayerID: string) => {
		socket?.emit(ROOM_EVENTS.TRANSFER_PARTY_LEADER, {
			room_id,
			player_id: transferToPlayerID,
		});
	};

	const changeName = () => {
		if (!socket) return;
		socket.emit(ROOM_EVENTS.CHANGE_NAME, {
			room_id,
			player_id,
			display_name,
			new_name: newName,
		});
	};

	return { removePlayer, handleContinue, transferPartyLeader, changeName };
}
