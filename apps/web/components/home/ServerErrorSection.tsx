import { IconAlertCircle } from "@tabler/icons";
import { getServerVersion } from "@troof/api";
import { useEffect, useState } from "react";

export default function ServerErrorSection() {
	const [serverActive, setServerActive] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			try {
				const sVersion = await getServerVersion();
				if (sVersion) setServerActive(true);
				else setServerActive(false);
			} catch (err) {
				setServerActive(false);
			}
		})();
	}, []);

	return (
		<>
			{!serverActive && (
				<div className="relative text-sm bg-rose-100 text-rose-900 border border-rose-600/50 font-semibold rounded-xl py-4 px-2 flex flex-col items-center my-10 gap-2">
					<IconAlertCircle className="my-1" />

					<h4 className="font-bold">We&apos;re having trouble</h4>

					<p>
						Our servers are currently experiencing issues. Please
						try again later. You can&apos;t join or create rooms.
					</p>
				</div>
			)}
		</>
	);
}
