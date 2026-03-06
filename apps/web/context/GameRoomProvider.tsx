/** @format */

import { Player } from "@troof/socket";
import { useContext } from "react";
import { useGameRoom } from "../hooks/useGameRoom";
import usePlayerNotification from "../hooks/usePlayerNotification";
import { GameContext } from "./GameContext";
import { PublicKeyProviderContext, UsePublicKeyType } from "./PublicKeyProvider";
import { RoomContext } from "./RoomContext";

interface GameRoomProviderProps {
	room_id: string;
	initialPlayer: Player;
	children: React.ReactNode;
}

export const GameRoomProvider = ({
	room_id,
	initialPlayer,
	children,
}: GameRoomProviderProps) => {
	const { setPublicKey } = useContext(PublicKeyProviderContext) as UsePublicKeyType;

	const {
		players,
		player,
		gameStatus,
		hasReceivedPlayers,
		hasReceivedGameStatus,
		hasReceivedPublicKey,
	} = useGameRoom({ room_id, initialPlayer, setPublicKey });

	usePlayerNotification(player, players);

	return (
		<RoomContext.Provider value={{ room_id, players, player }}>
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
