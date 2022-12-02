import { motion } from "framer-motion";

interface JoinRoomInterface {
	displayName: string;
	roomIDInput: string;
	setRoomIDInput: (roomIDInput: string) => void;
	setDisplayName: (displayName: string) => void;
	handleOnClick: () => void;
}

const JoinRoomSection = ({
	displayName,
	setDisplayName,
	roomIDInput,
	setRoomIDInput,
	handleOnClick,
}: JoinRoomInterface) => (
	<>
		<motion.input
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			type="text"
			placeholder="Display Name"
			className="input-huge my-2 text-center"
			value={displayName}
			onChange={(e) => setDisplayName(e.target.value)}
		/>

		<motion.input
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			type="text"
			placeholder="Room Code"
			className="input-huge my-2 text-center"
			value={roomIDInput}
			onChange={(e) => setRoomIDInput(e.target.value.toUpperCase())}
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
			Join Room
		</motion.button>
	</>
);

export default JoinRoomSection;
