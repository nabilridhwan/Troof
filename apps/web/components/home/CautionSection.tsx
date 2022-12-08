/** @format */

import { IconAlertTriangle, IconX } from "@tabler/icons";
import Link from "next/link";

interface CautionSectionProps {
	onClose: () => void;
}

export default function CautionSection({ onClose }: CautionSectionProps) {
	const handleClick = () => {
		localStorage.setItem("cautionDismissed", "true");
		onClose();
	};

	return (
		<div className="relative my-10 flex flex-col items-center gap-2 rounded-xl border border-yellow-600/50 bg-yellow-100 py-4 px-2 text-sm font-semibold text-yellow-900">
			<button
				className="absolute right-2 top-2 aspect-square rounded-lg p-1"
				onClick={handleClick}
			>
				<IconX size={18} />
			</button>

			<IconAlertTriangle className="my-1" />

			<h4 className="font-bold">Caution</h4>

			<p>
				This game contains mature themes and is intended for adults only. Please
				exercise caution while playing and only participate if you are of legal
				age.
			</p>

			<p className="mt-2 text-xs">
				Read more <Link href="/caution">here.</Link>
			</p>
		</div>
	);
}
