/** @format */

import { createRoom } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import { Cookie } from "../utils/Cookie";

export default function useCreateRoom() {
	const router = useRouter();

	async function create(display_name: string, captchaToken: string) {
		try {
			const res = await createRoom(display_name, captchaToken);

			const {
				status,
				data: {
					message,
					data: {
						room_id,
						room_creator: { player_id },
						token,
					},
				},
			} = res;

			console.log(status);

			// Set the room ID in the response so that when the user visits the room page, they can rejoin the room
			// Set player ID in cookies
			Cookie.setPlayerID(player_id);
			Cookie.setRoomID(room_id);
			Cookie.setToken(token);

			window.location.href = `/game/${room_id}`;
			return;
		} catch (error: any) {
			if (isAxiosError(error)) {
				let e: AxiosError<BadRequest | NotFoundResponse> = error;

				if (!e.response) {
					// The user does not have an internet connection because there is no error response hence why there is no reply from server
					router.push(
						"/?error=An unknown error occurred. Please try again later. (No connection to server)"
					);

					return;
				}

				const {
					status,
					data: { message },
				} = e.response;

				console.log(status);
				console.log(JSON.stringify(e.response?.data.data));

				window.location.href = `/?error=${message}`;
				return;
			}

			router.push(`/?error=An unknown error occurred. Please try again later.`);
			return;
		}
	}

	return { create };
}
