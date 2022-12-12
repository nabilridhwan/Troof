import { ScaleLoader } from "react-spinners";

const FullScreenLoadingScreen = () => {
	return (
		<div className="fixed top-0 left-0 z-[90] h-screen w-screen bg-primary">
			<div className="flex h-full w-full flex-col items-center justify-center gap-5 p-10 text-center text-black/70">
				<ScaleLoader loading={true} />
				<p>We&apos;re loading your game. This may take up to a minute.</p>
			</div>
		</div>
	);
};

export default FullScreenLoadingScreen;
