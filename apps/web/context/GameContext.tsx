/** @format */

import { createContext, useContext } from "react";

export type GameContextType = {
	gameStatus: string;
	hasReceivedPlayers: boolean;
	hasReceivedGameStatus: boolean;
};

export const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = (): GameContextType => {
	const ctx = useContext(GameContext);
	if (!ctx)
		throw new Error("useGameContext must be used within GameRoomProvider");
	return ctx;
};
