import {
	IconArrowForward,
	IconCrown,
	IconLogout,
	IconTrash,
} from "@tabler/icons";
import cx from "classnames";
import { motion } from "framer-motion";
import { useSocket } from "../hooks/useSocket";
import { Player, TRUTH_OR_DARE_GAME } from "../Types";

interface PlayersProps {
	players: Player[];
	player: Omit<Player, "game_room_id" | "joined_at">;
	room_id: string;
}

const Players = ({ players, player: p, room_id }: PlayersProps) => {
	const { socket } = useSocket();

	const removePlayer = (player_id: string) => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_GAME.LEAVE_GAME, {
			room_id: room_id,
			player_id: player_id,
		});
	};

	const handleContinue = () => {
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_GAME.CONTINUE, {
			room_id: room_id,
		});
	};

	return (
		<div className="my-2">
			{/* <p>Players ({players.length})</p> */}
			<div className="bg-black/5 my-1 rounded-2xl">
				{players.map((player, index) => (
					<div
						className="flex px-4 py-3 w-full even:bg-black/5"
						key={index}
					>
						<span
							className={cx({
								"flex-1": true,
							})}
						>
							{player.display_name}{" "}
							{player.player_id === p.player_id && (
								<span>(You)</span>
							)}
						</span>

						{player.is_party_leader && (
							<IconCrown className="mx-1 text-yellow-500" />
						)}

						{p.is_party_leader &&
							player.player_id !== p.player_id && (
								<button
									onClick={() =>
										removePlayer(player.player_id)
									}
								>
									<IconTrash className="mx-1 text-red-500" />
								</button>
							)}
					</div>
				))}

				{/* Buttons */}
				<div className="mx-2 py-2">
					{/* Show Force Continue button for party leader */}
					{p.is_party_leader && (
						<div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.9 }}
								className="btn my-2 bg-orange-500 text-white border-none flex items-center gap-2 text-sm"
								onClick={handleContinue}
							>
								<IconArrowForward size={16} />
								Force Skip
							</motion.button>
						</div>
					)}

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						className="btn my-2 bg-red-500 text-white border-none flex items-center gap-2 text-sm"
						onClick={() => removePlayer(p.player_id)}
					>
						<IconLogout size={16} />
						Leave Game
					</motion.button>
				</div>
			</div>
		</div>
	);
};

export default Players;
