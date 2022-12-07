import { AxiosError } from "axios";
import { NextPageContext } from "next";
import Head from "next/head";
import { joinRoom } from "../../services/joinRoom";
import { Cookie } from "../../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id, display_name } = context.query;

	try {
		const res = await joinRoom(room_id as string, display_name as string);

		const {
			data: {
				data: {
					player_id,
					room_id: room_id_response,
					status: room_status,
				},
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
		if (error instanceof AxiosError) {
			const { status } = error.response!;

			console.log(status);
			console.log(JSON.stringify(error.response?.data.data));

			if (status === 404) {
				return {
					redirect: {
						destination: `/?error=room_not_found`,
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
