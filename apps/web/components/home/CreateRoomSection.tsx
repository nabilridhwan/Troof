/** @format */

import { motion } from "framer-motion";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import useCreateRoom from "../../hooks/useCreateRoom";

interface CreateRoomSectionProps {
	displayName: string;
	setDisplayName: (displayName: string) => void;
	disabled: boolean;
}

const CreateRoomSection = ({
	displayName,
	disabled,
	setDisplayName,
}: CreateRoomSectionProps) => {
	const { create } = useCreateRoom();

	const [loading, setLoading] = useState(false);

	async function handleCreateRoom() {
		setLoading(true);
		await create(displayName);
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await handleCreateRoom();
			}}
		>
			<p className="text-right text-xs">{displayName.length}/20</p>
			<motion.input
				maxLength={20}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				type="text"
				placeholder="Display Name"
				className="input-huge my-2 text-center"
				value={displayName}
				onChange={(e) => setDisplayName(e.target.value)}
			/>

			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				whileHover={{
					scale: 1.1,
					transition: {
						ease: "easeOut",
					},
				}}
				whileTap={{
					scale: 0.9,
					transition: {
						ease: "easeOut",
					},
				}}
				disabled={loading}
				className="btn-huge m-10 disabled:opacity-50"
				onClick={handleCreateRoom}
			>
				{loading ? (
					<SyncLoader speedMultiplier={0.5} size={6} />
				) : (
					"Create Room"
				)}
			</motion.button>
		</form>
	);
};

export default CreateRoomSection;
