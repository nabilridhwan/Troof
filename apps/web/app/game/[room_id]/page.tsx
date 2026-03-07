import { getRoomBootstrap } from "@troof/api";
import { BadRequest, NotFoundResponse } from "@troof/responses";
import { RoomBootstrapState } from "@troof/socket";
import { AxiosError, isAxiosError } from "axios";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GamePageClient from "../../../components/GamePageClient";

const GENERIC_ERROR_MESSAGE =
	"An unknown error occurred. Please try again later.";
const NETWORK_ERROR_MESSAGE =
	"Unable to reach the server right now. Please check your connection and try again.";

function buildHomeRedirectURL({
	roomId,
	error,
}: {
	roomId?: string;
	error?: string;
}) {
	const searchParams = new URLSearchParams();

	if (roomId) {
		searchParams.set("room_id", roomId);
	}

	if (error) {
		searchParams.set("error", error);
	}

	const query = searchParams.toString();
	return query ? `/?${query}` : "/";
}

function getSafeErrorMessage(message: unknown) {
	if (typeof message !== "string") return GENERIC_ERROR_MESSAGE;

	const trimmedMessage = message.trim();
	if (!trimmedMessage) return GENERIC_ERROR_MESSAGE;

	return trimmedMessage.length > 200
		? `${trimmedMessage.slice(0, 200)}...`
		: trimmedMessage;
}

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
		redirect(buildHomeRedirectURL({ roomId: room_id }));
	}

	try {
		const bootstrapResponse = await getRoomBootstrap(token, room_id);
		const bootstrap: RoomBootstrapState = bootstrapResponse.data.data;

		if (!bootstrap?.self) {
			redirect(
				buildHomeRedirectURL({
					error: "Could not find your player session for this room.",
				})
			);
		}

		if (bootstrap.self.game_room_id !== room_id) {
			redirect(
				buildHomeRedirectURL({
					roomId: room_id,
					error: "Player is not in this room.",
				})
			);
		}

		return (
			<GamePageClient
				roomId={room_id}
				player={bootstrap.self}
				bootstrap={bootstrap}
			/>
		);
	} catch (error) {
		if (isAxiosError(error)) {
			const e: AxiosError<BadRequest | NotFoundResponse> = error;
			console.error("Failed to bootstrap room", e);

			if (!e.response) {
				redirect(
					buildHomeRedirectURL({
						roomId: room_id,
						error: NETWORK_ERROR_MESSAGE,
					})
				);
			}

			redirect(
				buildHomeRedirectURL({
					roomId: room_id,
					error: getSafeErrorMessage(e.response.data?.message),
				})
			);
		}

		redirect(
			buildHomeRedirectURL({
				roomId: room_id,
				error: GENERIC_ERROR_MESSAGE,
			})
		);
	}
}
