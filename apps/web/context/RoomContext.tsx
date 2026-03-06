/** @format */

import { Player } from "@troof/socket";
import { createContext, useContext } from "react";

export type RoomContextType = {
	room_id: string;
	players: Player[];
	player: Player;
};

export const RoomContext = createContext<RoomContextType | null>(null);

export const useRoomContext = (): RoomContextType => {
	const ctx = useContext(RoomContext);
	if (!ctx) throw new Error("useRoomContext must be used within GameRoomProvider");
	return ctx;
};
