/** @format */

import { joinRoom } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { AxiosError, isAxiosError } from "axios";
import { NextPageContext } from "next";
import Head from "next/head";
import { Cookie } from "../../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id, display_name } = context.query;

	try {
		const res = await joinRoom(room_id as string, display_name as string);

		const {
			data: {
				data: { player_id, room_id: room_id_response, status: room_status },
			},
		} = res;

		// TODO: Set the room ID in the response so that when the user visits the room page, they can rejoin the room
		// Set player ID in cookie
		Cookie.setPlayerID(player_id, context.req, context.res);
		Cookie.setRoomID(room_id_response, context.req, context.res);

		console.log(room_status);

		return {
			redirect: {
				destination: `/game/${room_id}`,
				permanent: true,
			},
		};
	} catch (error) {
		if (isAxiosError(error)) {
			let e: AxiosError<BadRequest | NotFoundResponse> = error;

			if (!e.response) {
				// The user does not have an internet connection because there is no error response hence why there is no reply from server
				console.log(
					"The user does not have an internet connection because there is no error response (No connection to server)"
				);
				return {
					redirect: {
						destination:
							"/?error=An unknown error occurred. Please try again later. (No connection to server)",
						permanent: false,
					},
				};
			}

			const {
				status,
				data: { message },
			} = e.response;

			console.log(status);
			console.log(JSON.stringify(e.response?.data.data));

			if (status === 404) {
				return {
					redirect: {
						destination: `/?error=${message}`,
						permanent: true,
					},
				};
			}
		}

		// TODO: Error handling
		return {
			redirect: {
				destination: `/?room_id=${room_id}`,
				permanent: true,
			},
		};
	}
}

export default function JoinPage() {
	return (
		<div>
			<Head>
				<title>Join a game</title>
				<meta
					name="description"
					content="Come play a synchronized truth or dare game with me!"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
		</div>
	);
}
