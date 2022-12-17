/** @format */

import { joinRoom } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import { Cookie } from "../utils/Cookie";

// Export getServerSideProps to get the query string
export default function useJoinRoom() {
	const router = useRouter();

	async function join(
		display_name: string,
		room_id: string,
		captchaToken: string
	) {
		try {
			const res = await joinRoom(
				room_id as string,
				display_name as string,
				captchaToken
			);

			const {
				data: {
					data: {
						player_id,
						room_id: room_id_response,
						status: room_status,
						token,
					},
				},
			} = res;

			// TODO: Set the room ID in the response so that when the user visits the room page, they can rejoin the room
			// Set player ID in cookie
			Cookie.setPlayerID(player_id);
			Cookie.setRoomID(room_id_response);
			Cookie.setToken(token);

			console.log(room_status);

			window.location.href = `/game/${room_id}`;
			return;
		} catch (error) {
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

	return { join };
}
