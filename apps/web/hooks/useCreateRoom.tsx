/** @format */

import { createRoom } from "@troof/api";
import { useRouter } from "next/router";
import { Cookie } from "../utils/Cookie";

export default function useCreateRoom() {
	const router = useRouter();

	async function create(display_name: string) {
		try {
			const res = await createRoom(display_name);

			const {
				status,
				data: {
					message,
					data: {
						room_id,
						room_creator: { player_id },
					},
				},
			} = res;

			console.log(status);

			// Set the room ID in the response so that when the user visits the room page, they can rejoin the room
			// Set player ID in cookies
			Cookie.setPlayerID(player_id);
			Cookie.setRoomID(room_id);

			router.push(`/game/${room_id}`);
			return;
		} catch (error: any) {
			router.push(`/`);
			return;
		}
	}

	return { create };
}
