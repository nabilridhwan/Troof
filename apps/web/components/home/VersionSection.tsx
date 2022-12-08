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
		<p className="font-semibold text-xs text-center  mb-6 mt-2 space-x-1.5 flex justify-center">
			<span
				title="Game Version"
				className="flex bg-gray-800 text-gray-200 rounded-lg py-1 px-2 gap-1 items-center"
			>
				<span className="text-xs">
					<IconDeviceGamepad size={20} />
				</span>{" "}
				{clientVersion}
			</span>

			<span
				title="Server Version"
				className="flex bg-gray-800 text-gray-200 rounded-lg py-1 px-2 gap-1 items-center"
			>
				{loadingServerVersion ? (
					<span className="w-fit h-fit animate-spin">
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
