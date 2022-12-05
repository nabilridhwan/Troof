import { IconQuestionMark } from "@tabler/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cookie } from "../../utils/Cookie";

const ExistingGameSection = ({ onClose }: { onClose: () => void }) => {
	const [player_id, setPlayer_id] = useState(Cookie.getPlayerID());

	const [room_id, setRoom_id] = useState(Cookie.getRoomId());

	useEffect(() => {
		console.log(player_id, room_id);
	}, []);

	const joinGame = () => {
		// Redirect to /game/[room_id]
		window.location.href = `/game/${room_id}`;
	};

	return (
		<motion.div className="my-10">
			<div className="text-sm bg-blue-100 text-blue-900 border border-blue-600/50 font-semibold rounded-xl py-4 px-2 flex flex-col items-center my-10">
				<IconQuestionMark className="my-1" />
				<p className="font-bold mb-3">Accidentally left the game?</p>
				<p>
					It looks like you accidentally left the game. To return to
					your game, click the button below.
				</p>

				<div className="mt-5 w-full">
					<button
						onClick={joinGame}
						className="btn my-1 bg-green-100 text-green-900 border-green-600/50"
					>
						Return to Game
					</button>

					<button
						onClick={onClose}
						className="btn my-1 bg-red-100 text-red-900 border-red-600/50"
					>
						It&apos;s intentional!
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default ExistingGameSection;
