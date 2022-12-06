import { IconAlertTriangle } from "@tabler/icons";
import Link from "next/link";

export default function CautionSection() {
	return (
		<div className="text-sm bg-yellow-100 text-yellow-900 border border-yellow-600/50 font-semibold rounded-xl py-4 px-2 flex flex-col items-center my-10 gap-2">
			<IconAlertTriangle className="my-1" />

			<h4 className="font-bold">Caution</h4>

			<p>
				This game contains mature themes and is intended for adults
				only. Please exercise caution while playing and only participate
				if you are of legal age.
			</p>

			<p className="text-xs mt-2">
				Read more <Link href="/caution">here.</Link>
			</p>
		</div>
	);
}
