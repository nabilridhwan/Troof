import { nanoid } from "nanoid";
import { NextPageContext } from "next/types";
import prisma from "../database/prisma";
import { Cookie } from "../utils/Cookie";
import { STATUS, Type } from "../utils/GameDataTypes";

// Export getServerSideProps to get the query string
export async function getServerSideProps(context: NextPageContext) {
	// Generate a random room id
	const room_id = nanoid(6).toUpperCase();

	const { display_name } = context.query;

	if (!room_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const { room_id: inserted_room_id } = await prisma.game.create({
		data: {
			room_id,
			game_type: Type.TruthOrDare,
			status: STATUS.IN_LOBBY,
		},
		select: {
			room_id: true,
		},
	});

	const { player_id } = await prisma.player.create({
		data: {
			game_room_id: inserted_room_id,
			display_name: display_name as string,
			is_party_leader: true,
		},
		select: {
			player_id: true,
		},
	});

	// Set player ID in cookies
	Cookie.setPlayerID(player_id, context.req, context.res);

	return {
		redirect: {
			destination: `/lobby/${room_id}`,
			permanent: true,
		},
	};
}

export default function CreateRoomPage() {
	return <div></div>;
}
