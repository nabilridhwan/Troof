import {
	IconArrowForward,
	IconCrown,
	IconLogout,
	IconTrash,
} from "@tabler/icons";

import cx from "classnames";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";
import { Player, TRUTH_OR_DARE_GAME } from "../Types";
import ProfilePictureFromName from "./ProfilePictureFromName";

interface PlayersProps {
	players: Player[];
	player: Omit<Player, "game_room_id" | "joined_at">;
	room_id: string;
}

const Players = ({ players, player: p, room_id }: PlayersProps) => {
	const socket = useContext(SocketProviderContext);

	let [menuOpen, setMenuOpen] = useState(false);
	const [newName, setNewName] = useState(p.display_name);

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

	const changeName = () => {
		console.log("The changing name function is retracted back.");
		// if (!socket) return;
		// socket.emit(EVENTS.CHANGE_NAME, {
		// 	room_id: room_id,
		// 	player_id: p.player_id,
		// 	display_name: p.display_name,
		// 	new_name: newName,
		// });
	};

	return (
		<div className="my-2 w-full max-h-full">
			{/* <p>Players ({players.length})</p> */}

			<p>Players</p>
			<div className="bg-white/30 border border-black/10 my-1 rounded-2xl h-full">
				<div className="max-h-full overflow-y-auto">
					{players.map((player, index) => (
						<div
							className="flex items-center px-4 py-5 w-full even:bg-black/5"
							key={index}
						>
							<div className="mr-2">
								<ProfilePictureFromName
									name={player.display_name}
								/>
							</div>

							<span
								className={cx({
									"flex-1": true,
									"break-all": true,
									"font-bold":
										player.player_id === p.player_id,
								})}
							>
								{player.display_name}{" "}
								{player.player_id === p.player_id && (
									<span>(You)</span>
								)}
							</span>

							{/* Crown */}
							{player.is_party_leader && (
								<IconCrown className="mr-1 text-yellow-500" />
							)}

							<div className="flex gap-2">
								{p.is_party_leader &&
									player.player_id !== p.player_id && (
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="aspect-square bg-red-300 text-red-900 p-2 rounded-lg"
											onClick={() =>
												removePlayer(player.player_id)
											}
										>
											<IconTrash className="" size={18} />
										</motion.button>
									)}

								{/* {player.player_id === p.player_id && (
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className="aspect-square bg-blue-300 text-blue-900 p-2 rounded-lg"
										onClick={() => setMenuOpen(true)}
									>
										<IconPencil size={18} />
									</motion.button>
								)} */}
							</div>
						</div>
					))}
				</div>

				{/* Buttons */}
				<div className="mx-2 py-2">
					{/* Show Force Continue button for party leader */}
					{p.is_party_leader && (
						<div>
							<motion.button
								disabled={players.length < 2}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.9 }}
								className="btn disabled:opacity-70 my-2 bg-teal-300 text-teal-900 border-none flex items-center gap-2 text-sm"
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
						className="btn my-2 bg-red-300 text-red-900 border-none flex items-center gap-2 text-sm"
						onClick={() => removePlayer(p.player_id)}
					>
						<IconLogout size={16} />
						Leave Game
					</motion.button>
				</div>
			</div>

			{/* <Transition appear show={menuOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setMenuOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary border-black/20 p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Change Name
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Enter a new name
										</p>

										<input
											type="text"
											className="w-full border border-gray-300 rounded-lg p-2 mt-2"
											value={newName}
											onChange={(e) =>
												setNewName(e.target.value)
											}
										/>
									</div>

									<div className="mt-4 flex flex-wrap gap-1">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											onClick={() => {
												if (newName.trim() !== "") {
													changeName();
													setMenuOpen(false);
												}
											}}
										>
											Change my name
										</button>

										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											onClick={() => {
												setMenuOpen(false);
											}}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition> */}
		</div>
	);
};

export default Players;
