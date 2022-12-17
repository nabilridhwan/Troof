import { Player } from "@troof/socket";
import { useEffect, useRef } from "react";
import { Notify } from "../utils/Notify";

const usePlayerNotification = (player: Player, players: Player[]) => {
	const notified = useRef<boolean>(false);

	useEffect(() => {
		console.log(
			"🚀 ~ file: usePlayerNotification.ts:19 ~ useEffect ~ notified.current",
			notified.current
		);

		if (players.length >= 2) {
			// Create new notification to tell the user that the game has started
			// Only send it to the first user
			const sortedPlayers = players.sort(
				(a, b) =>
					new Date(a.joined_at!).getTime() - new Date(b.joined_at!).getTime()
			);

			if (player.player_id === sortedPlayers[0].player_id) {
				if (!notified.current) {
					Notify.createNewNotification("Game has started", {
						body: `Hey ${player.display_name}, Someone else has joined, the game has started!`,
						renotify: false,
						requireInteraction: false,
					});

					notified.current = true;
				}
			}
		} else {
			// If the players ever fall under 2, set notified to false
			notified.current = false;
		}
	}, [players]);
};

export default usePlayerNotification;
