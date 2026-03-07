/** @format */

import { getPlayer } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { Player } from "@troof/socket";
import { AxiosError, isAxiosError } from "axios";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { permanentRedirect, redirect } from "next/navigation";
import GamePageClient from "../../../components/GamePageClient";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ room_id: string }>;
}): Promise<Metadata> {
	const { room_id } = await params;
	return {
		title: `Troof! (${room_id})`,
	};
}

export default async function GamePage({
	params,
}: {
	params: Promise<{ room_id: string }>;
}) {
	const { room_id } = await params;

	const cookieStore = await cookies();
	const player_id = cookieStore.get("player_id")?.value ?? null;
	const token = cookieStore.get("token")?.value ?? null;

	if (!player_id || !token) {
		permanentRedirect(`/?room_id=${room_id}`);
	}

	try {
		// Find the player using the API
		const playerAPIData = await getPlayer(token);
		const player = playerAPIData.data.data;

		if (!player) {
			permanentRedirect("/");
		}

		const rtnPlayer: Player = {
			is_party_leader: player.is_party_leader,
			display_name: player.display_name,
			player_id: player.player_id,
			game_room_id: player.game_room_id,
			joined_at: null,
		};

		return <GamePageClient r={room_id} player={rtnPlayer} />;
	} catch (error) {
		if (isAxiosError(error)) {
			let e: AxiosError<BadRequest | NotFoundResponse> = error;

			console.log(e);

			if (!e.response) {
				// The user does not have an internet connection because there is no error response hence why there is no reply from server
				console.log(
					"The user does not have an internet connection because there is no error response (No connection to server)"
				);
				permanentRedirect(
					"/?error=An unknown error occurred. Please try again later. (No connection to server)"
				);
			}

			let {
				data: { message },
			} = e.response;
			permanentRedirect(`/?error=${message}`);
		}

		redirect(
			"/?error=An unknown error occurred. Please try again later."
		);
	}
}
