/** @format */

import { Player, RoomBootstrapState } from "@troof/socket";
import { useContext } from "react";
import { useGameRoom } from "../hooks/useGameRoom";
import usePlayerNotification from "../hooks/usePlayerNotification";
import { GameContext } from "./GameContext";
import {
	PublicKeyProviderContext,
	UsePublicKeyType,
} from "./PublicKeyProvider";
import { RoomContext } from "./RoomContext";

interface GameRoomProviderProps {
	room_id: string;
	initialPlayer: Player;
	initialBootstrap: RoomBootstrapState;
	children: React.ReactNode;
}

export const GameRoomProvider = ({
	room_id,
	initialPlayer,
	initialBootstrap,
	children,
}: GameRoomProviderProps) => {
	const { setPublicKey } = useContext(
		PublicKeyProviderContext
	) as UsePublicKeyType;

	const {
		players,
		player,
		gameStatus,
		hasReceivedPlayers,
		hasReceivedGameStatus,
		hasReceivedPublicKey,
	} = useGameRoom({
		room_id,
		initialPlayer,
		initialBootstrap,
		setPublicKey,
	});

	const bootstrap = {
		current_player: initialBootstrap.current_player,
		latest_log: initialBootstrap.latest_log,
		latest_messages: initialBootstrap.latest_messages,
	};

	usePlayerNotification(player, players);

	return (
		<RoomContext.Provider value={{ room_id, players, player, bootstrap }}>
			<GameContext.Provider
				value={{
					gameStatus,
					hasReceivedPlayers,
					hasReceivedGameStatus,
					hasReceivedPublicKey,
				}}
			>
				{children}
			</GameContext.Provider>
		</RoomContext.Provider>
	);
};
