import { motion } from "framer-motion";

interface CreateRoomSectionProps {
	displayName: string;
	setDisplayName: (displayName: string) => void;
	handleOnClick: () => void;
}

const CreateRoomSection = ({
	displayName,
	setDisplayName,
	handleOnClick,
}: CreateRoomSectionProps) => (
	<>
		<motion.input
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			type="text"
			placeholder="Display Name"
			className="input-huge my-10 text-center"
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
			className="btn-huge m-10"
			onClick={handleOnClick}
		>
			Create Room
		</motion.button>
	</>
);

export default CreateRoomSection;
