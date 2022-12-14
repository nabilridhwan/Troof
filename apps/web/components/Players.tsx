/** @format */

import { Dialog, Menu, Transition } from "@headlessui/react";
import {
	IconCrown,
	IconDotsVertical,
	IconLogout,
	IconPencil,
	IconPlayerTrackNext,
	IconUserMinus,
} from "@tabler/icons";

import { EVENTS, Player, TRUTH_OR_DARE_GAME } from "@troof/socket";
import cx from "classnames";
import { motion } from "framer-motion";
import { Fragment, useContext, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";
import ProfilePictureFromName from "./ProfilePictureFromName";

interface PlayersProps {
	players: Player[];
	player: Omit<Player, "game_room_id" | "joined_at">;
	currentPlayer: Partial<Player>;
	room_id: string;
}

const Players = ({
	players,
	player: p,
	room_id,
	currentPlayer,
}: PlayersProps) => {
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

	const transferPartyLeader = (transferToPlayerID: string) => {
		socket?.emit(EVENTS.TRANSFER_PARTY_LEADER, {
			room_id: room_id,
			player_id: transferToPlayerID,
		});
	};

	const changeName = () => {
		// console.log("The changing name function is retracted back.");
		if (!socket) return;
		socket.emit(EVENTS.CHANGE_NAME, {
			room_id: room_id,
			player_id: p.player_id,
			display_name: p.display_name,
			new_name: newName,
		});
	};

	return (
		<div className="my-2 max-h-full w-full">
			{/* <p>Players ({players.length})</p> */}

			<div className="my-1 h-full rounded-2xl border border-black/10 bg-white/30">
				<div className="max-h-full ">
					{players.map((player, index) => (
						<div
							className="flex min-h-[50px] w-full flex-wrap items-center gap-2 px-4 py-2 even:bg-black/5"
							key={index}
						>
							<div className="mr-2">
								<ProfilePictureFromName name={player.display_name} />
							</div>

							<span
								className={cx({
									"flex-1": true,
									"break-all": true,
									// "font-bold": player.player_id === p.player_id,

									"transition-all duration-100 ease-out": true,
									"font-semibold": currentPlayer.player_id === player.player_id,
								})}
							>
								{player.display_name}{" "}
								{player.player_id === p.player_id && <span>(You)</span>}
							</span>

							{/* Crown */}
							{player.is_party_leader && (
								<IconCrown className="mr-1 text-yellow-500" />
							)}

							{/* Buttons */}
							<div className="flex gap-2 text-xs">
								{p.is_party_leader &&
									player.player_id === currentPlayer.player_id && (
										<motion.button
											whileHover={{ scale: 1.1 }}
											disabled={players.length === 1}
											whileTap={{ scale: 0.9 }}
											className="flex h-fit w-fit items-center  justify-center gap-1 rounded-lg border border-amber-900/25 bg-amber-300 p-2 text-amber-900 disabled:opacity-50"
											onClick={() => handleContinue()}
										>
											<IconPlayerTrackNext size={16} />
											<p>Skip</p>
										</motion.button>
									)}

								{/* Only show button to party leader for OTHER players */}
								{(p.is_party_leader || player.player_id === p.player_id) && (
									<Menu as="div" className="relative">
										<Menu.Button className="border-black-900/25 bg-black-300 text-black-900 flex  h-fit w-fit items-center justify-center gap-1 rounded-lg border p-2">
											<IconDotsVertical size={16} />
										</Menu.Button>

										<Menu.Items className="absolute right-0 z-50 flex w-[200px] flex-col gap-2 rounded-lg border border-black/30 bg-white p-1 text-sm shadow-lg">
											{p.is_party_leader &&
												player.player_id !== p.player_id && (
													<Menu.Item
														as="div"
														role="button"
														className="flex cursor-pointer items-center gap-2 rounded-lg p-2 px-2 hover:bg-yellow-200 hover:text-yellow-900"
														onClick={() =>
															transferPartyLeader(player.player_id)
														}
													>
														<IconCrown className="text-yellow-500" size={18} />
														<p>Set as Party Leader</p>
													</Menu.Item>
												)}

											{p.is_party_leader &&
												player.player_id !== p.player_id && (
													<Menu.Item
														as="div"
														className="flex cursor-pointer items-center gap-2 rounded-lg p-2 px-2 hover:bg-red-200 hover:text-red-900"
														onClick={() => removePlayer(player.player_id)}
													>
														<IconUserMinus className="text-red-500" size={18} />

														<p>Remove Player</p>
													</Menu.Item>
												)}

											{player.player_id === p.player_id && (
												<Menu.Item
													as="div"
													className="flex cursor-pointer items-center gap-2 rounded-lg p-2 px-2 hover:bg-blue-200 hover:text-blue-900"
													onClick={() => setMenuOpen(true)}
												>
													<IconPencil className="text-blue-500" size={18} />

													<p>Change Display Name</p>
												</Menu.Item>
											)}
										</Menu.Items>
									</Menu>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Buttons */}
				<div className="mx-2 py-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						className="btn my-2 flex items-center gap-2 border border-red-900/30 bg-red-100 text-sm text-red-900"
						onClick={() => removePlayer(p.player_id)}
					>
						<IconLogout size={16} />
						Leave Game
					</motion.button>
				</div>
			</div>

			{/* Change name dialog */}
			<Transition appear show={menuOpen} as={Fragment}>
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
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border-black/20 bg-primary p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Change Name
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">Enter a new name</p>

										<input
											type="text"
											className="mt-2 w-full rounded-lg border border-gray-300 p-2"
											value={newName}
											onChange={(e) => setNewName(e.target.value)}
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
			</Transition>
		</div>
	);
};

export default Players;
