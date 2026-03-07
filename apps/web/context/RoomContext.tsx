/** @format */

import { Log, MessageUpdatedFromServer, Player } from "@troof/socket";
import { createContext, useContext } from "react";

type BootstrapRoomContext = {
	current_player: Player | null;
	latest_log: Log | null;
	latest_messages: MessageUpdatedFromServer[];
};

export type RoomContextType = {
	room_id: string;
	players: Player[];
	player: Player;
	bootstrap: BootstrapRoomContext;
};

export const RoomContext = createContext<RoomContextType | null>(null);

export const useRoomContext = (): RoomContextType => {
	const ctx = useContext(RoomContext);
	if (!ctx)
		throw new Error("useRoomContext must be used within GameRoomProvider");
	return ctx;
};
