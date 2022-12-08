/** @format */

import { motion } from "framer-motion";

interface CreateRoomSectionProps {
	displayName: string;
	setDisplayName: (displayName: string) => void;
	handleOnClick: () => void;
	disabled: boolean;
}

const CreateRoomSection = ({
	displayName,
	disabled,
	setDisplayName,
	handleOnClick,
}: CreateRoomSectionProps) => (
	<form
		onSubmit={(e) => {
			e.preventDefault();
			handleOnClick();
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
			disabled={disabled}
			className="btn-huge m-10 disabled:opacity-50"
			onClick={handleOnClick}
		>
			Create Room
		</motion.button>
	</form>
);

export default CreateRoomSection;
