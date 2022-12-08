/** @format */

import { IconDeviceGamepad, IconDice, IconServer } from "@tabler/icons";
import { getServerVersion } from "@troof/api";
import { useEffect, useState } from "react";
import pkgjson from "../../package.json";

const VersionSection = () => {
	const [serverVersion, setServerVersion] = useState<string>("");
	const [clientVersion, setClientVersion] = useState<string>(
		"v" + pkgjson.version
	);

	const [loadingServerVersion, setLoadingServerVersion] =
		useState<boolean>(true);

	useEffect(() => {
		(async () => {
			setLoadingServerVersion(true);
			try {
				const sVersion = await getServerVersion();

				setServerVersion("v" + sVersion);
			} catch (err) {
				setServerVersion("Error");
			} finally {
				setLoadingServerVersion(false);
			}
		})();
	}, []);

	return (
		<p className="mb-6 mt-2 flex  justify-center space-x-1.5 text-center text-xs font-semibold">
			<span
				title="Game Version"
				className="flex items-center gap-1 rounded-lg bg-gray-800 py-1 px-2 text-gray-200"
			>
				<span className="text-xs">
					<IconDeviceGamepad size={20} />
				</span>{" "}
				{clientVersion}
			</span>

			<span
				title="Server Version"
				className="flex items-center gap-1 rounded-lg bg-gray-800 py-1 px-2 text-gray-200"
			>
				{loadingServerVersion ? (
					<span className="h-fit w-fit animate-spin">
						<IconDice size={20} />
					</span>
				) : (
					<>
						<span className="text-xs">
							<IconServer size={20} />
						</span>{" "}
						{serverVersion}
					</>
				)}
			</span>
		</p>
	);
};

export default VersionSection;
