/** @format */

import { motion } from "framer-motion";
import { useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import Reaptcha from "reaptcha";
import useJoinRoom from "../../hooks/useJoinRoom";

interface JoinRoomInterface {
	displayName: string;
	roomIDInput: string;
	setRoomIDInput: (roomIDInput: string) => void;
	setDisplayName: (displayName: string) => void;
}

const JoinRoomSection = ({
	displayName,
	setDisplayName,
	roomIDInput,
	setRoomIDInput,
}: JoinRoomInterface) => {
	const { join } = useJoinRoom();

	const [loading, setLoading] = useState(false);
	const [captchaVerified, setCaptchaVerified] = useState(false);
	const [captchaToken, setCaptchaToken] = useState("");

	const handleJoinRoom = async () => {
		setLoading(true);
		await join(displayName, roomIDInput, captchaToken);
		setLoading(false);
	};

	const handleRecaptchaError = () => {
		setCaptchaVerified(false);
		window.location.href = "/?error=Please verify that you are not a robot.";
	};

	const handleRecaptchaVerified = (recaptchaToken: string) => {
		setCaptchaToken(recaptchaToken);
	};

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await handleJoinRoom();
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

			<motion.input
				maxLength={4 * 4 + 3}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				type="text"
				placeholder="Room Code"
				className="input-huge my-2 text-center font-mono "
				value={roomIDInput}
				onChange={(e) => setRoomIDInput(e.target.value.toLowerCase())}
			/>

			<div className="flex justify-center">
				<Reaptcha
					sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
					size="normal"
					onVerify={handleRecaptchaVerified}
					onError={handleRecaptchaError}
					onExpire={handleRecaptchaError}
				/>
			</div>

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
				disabled={loading || !captchaToken}
				className="btn-huge m-10 disabled:opacity-50"
				onClick={handleJoinRoom}
			>
				{loading ? <SyncLoader speedMultiplier={0.5} size={6} /> : "Join Room"}
			</motion.button>
		</form>
	);
};

export default JoinRoomSection;
