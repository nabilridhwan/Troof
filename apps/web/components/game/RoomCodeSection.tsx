import { IconCornerLeftUp, IconLink } from "@tabler/icons";
import { motion } from "framer-motion";
import { useState } from "react";

interface RoomCodeSectionProps {
	room_id: string;
}

const RoomCodeSection = ({ room_id }: RoomCodeSectionProps) => {
	// This state below is for the Room code text. after copying, it will change to "Copied!"
	const [roomCodeText, setRoomCodeText] = useState<string>(`${room_id}`);

	const handleCopyRoomCode = () => {
		navigator.clipboard.writeText(`${window.location.origin}/game/${room_id}`);

		// Show Copied! for a second
		setRoomCodeText("Copied!");
		setTimeout(() => {
			setRoomCodeText(`${room_id}`);
		}, 1000);
	};

	return (
		<>
			{/* Room code */}
			<div className="my-5 flex flex-col gap-5 text-center">
				<p className="flex items-center justify-center text-xs font-semibold">
					Room Code (Send it to your friends!)
				</p>

				{/* Room Code */}
				<motion.p
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="cursor-pointer text-center font-mono text-sm font-bold"
					onClick={handleCopyRoomCode}
				>
					<span className="mx-auto flex w-fit items-center gap-1 rounded-lg bg-black py-1 px-2 text-xs text-white">
						<IconLink size={16} />
						{roomCodeText}
					</span>
				</motion.p>

				<p className="flex items-center justify-center text-xs">
					<IconCornerLeftUp size={15} />
					Click to copy
				</p>
			</div>
		</>
	);
};

export default RoomCodeSection;
