import { IconBell } from "@tabler/icons";
import { useEffect, useState } from "react";
import { NotificationPermissionStatus, Notify } from "../../utils/Notify";

export default function RequestForNotificationSection() {
	const [permission, setPermission] = useState<NotificationPermissionStatus>(
		NotificationPermissionStatus.Granted
	);

	const [show, setShow] = useState(true);

	async function getNotifyPermission() {
		return Notify.requestForNotificationPermission(true);
	}

	useEffect(() => {
		(async () => {
			const result = await getNotifyPermission();
			setPermission(result);
			console.log(
				"🚀 ~ file: RequestForNotificationSection.tsx:12 ~ result",
				result
			);
		})();
	}, []);

	// ! Guard statement
	// if (permission === NotificationPermissionStatus.Granted || !show) return null;
	return null;

	const requestForNotificationPermission = async () => {
		const result = await getNotifyPermission();
		setPermission(result);
		// setShow(false);
	};

	return (
		<div
			// onClick={() => setShow(false)}
			className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center  bg-black/30 backdrop-blur-sm"
		>
			<div className="m-4 flex flex-col items-center justify-center space-y-2 rounded-3xl bg-primary p-8 py-10 text-center shadow-2xl">
				<IconBell />
				<h1 className="text-2xl font-bold">Enable notifications?</h1>
				<p>
					Notifications are used to enable you to receive updates when someone
					else joins the room. You can disable anytime by going into your
					browser settings.
				</p>

				<button
					className="btn bg-green-300 text-green-900"
					onClick={requestForNotificationPermission}
				>
					Sure!
				</button>
				<button className="btn bg-red-300 text-red-900">Not this time!</button>
			</div>
		</div>
	);
}
