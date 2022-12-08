import { createRoom } from "@troof/api";
import { NextPageContext } from "next/types";
import { Cookie } from "../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	const { display_name } = context.query;

	try {
		const res = await createRoom(display_name as string);

		console.log(res);

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

		// Get the room ID and player ID from the response

		// TODO: Set the room ID in the response so that when the user visits the room page, they can rejoin the room
		// Set player ID in cookies
		Cookie.setPlayerID(player_id, context.req, context.res);
		Cookie.setRoomID(room_id, context.req, context.res);

		return {
			redirect: {
				destination: `/game/${room_id}`,
				permanent: true,
			},
		};
	} catch (error: any) {
		console.log(error);
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
}

export default function CreateRoomPage() {
	return <div></div>;
}
