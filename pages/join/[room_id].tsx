import { NextPageContext } from "next";
import prisma from "../../database/prisma";
import { Cookie } from "../../utils/Cookie";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id, display_name } = context.query;

	if (!room_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// TODO: Check if the room exists

	const foundRoom = await prisma.game.findFirst({
		where: {
			room_id: room_id as string,
		},
	});

	console.log(foundRoom);

	if (!foundRoom) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const players = await prisma.player.findMany({
		where: {
			game_room_id: room_id as string,
		},
	});

	if (players.length === 0) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// Create the player and associate it with the room
	const { player_id } = await prisma.player.create({
		data: {
			game_room_id: room_id as string,
			display_name: display_name as string,
			is_party_leader: false,
		},
	});

	// Set player ID in cookie
	Cookie.setPlayerID(player_id, context.req, context.res);

	return {
		redirect: {
			destination: `/lobby/${room_id}`,
			permanent: true,
		},
	};
}

export default function JoinPage() {
	return <div></div>;
}
