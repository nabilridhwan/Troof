import { NextPageContext } from "next/types";
import axiosInstance from "../utils/axiosInstance";
import { Cookie } from "../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	const { display_name } = context.query;

	try {
		const res = await axiosInstance.post("/api/room", {
			display_name,
		});

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

		// Get the room ID and player ID from the response

		// TODO: Set the room ID in the response so that when the user visits the room page, they can rejoin the room
		// Set player ID in cookies
		Cookie.setPlayerID(player_id, context.req, context.res);

		return {
			redirect: {
				destination: `/lobby/${room_id}`,
				permanent: true,
			},
		};
	} catch (error: any) {
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
