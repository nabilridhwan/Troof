import { NextPageContext } from "next";
import axiosInstance from "../../utils/axiosInstance";
import { Cookie } from "../../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id, display_name } = context.query;

	try {
		const res = await axiosInstance.post("/api/room/join", {
			room_id,
			display_name,
		});

		const { player_id, room_id: room_id_response } = res.data.data;

		// TODO: Set the room ID in the response so that when the user visits the room page, they can rejoin the room
		// Set player ID in cookie
		Cookie.setPlayerID(player_id, context.req, context.res);

		return {
			redirect: {
				destination: `/lobby/${room_id}`,
				permanent: true,
			},
		};
	} catch (error) {
		console.log(error);
		// TODO: Error handling
		return {
			redirect: {
				destination: `/`,
				permanent: true,
			},
		};
	}
}

export default function JoinPage() {
	return <div></div>;
}
