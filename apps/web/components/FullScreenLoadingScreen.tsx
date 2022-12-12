import { motion } from "framer-motion";
import { ScaleLoader } from "react-spinners";

const FullScreenLoadingScreen = () => {
	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed top-0 left-0 z-[90] h-screen w-screen bg-primary"
		>
			<div className="flex h-full w-full flex-col items-center justify-center gap-5 p-10 text-center text-black/70">
				<ScaleLoader loading={true} />
				<p>We&apos;re loading your game. This may take up to a minute.</p>
			</div>
		</motion.div>
	);
};

export default FullScreenLoadingScreen;
