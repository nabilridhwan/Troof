// Library to create new notification and request for permission using default api

export const enum NotificationPermissionStatus {
	Granted = "granted",
	Denied = "denied",
	Default = "default",
	NotSupported = "not-supported",
}

export namespace Notify {
	export function createNewNotification(
		title: string,
		options?: NotificationOptions
	) {
		if (!options) {
			return new Notification(title);
		}

		return new Notification(title, options);
	}

	/**
	 * A function that requests for notification permission, forces user to accept every time the method is called if 'force' is true.
	 *
	 * @export
	 * @param {boolean} [force=false]
	 * @return {*}  {Promise<NotificationPermissionStatus>}
	 */
	export async function requestForNotificationPermission(
		force = false
	): Promise<NotificationPermissionStatus> {
		// Check if Notification is available in window
		if (!("Notification" in window)) {
			return NotificationPermissionStatus.NotSupported;
		}

		if (Notification.permission === NotificationPermissionStatus.Granted) {
			return NotificationPermissionStatus.Granted;
		}

		if (Notification.permission === NotificationPermissionStatus.Denied) {
			if (!force) return NotificationPermissionStatus.Denied;
		}

		// Since its default, request for permission again
		try {
			console.log("Requesting for permission");
			const permission = await Notification.requestPermission();
			console.log("🚀 ~ file: Notify.ts:49 ~ permission", permission);
			return permission as NotificationPermissionStatus;
		} catch (err) {
			return NotificationPermissionStatus.Denied;
		}
	}
}
