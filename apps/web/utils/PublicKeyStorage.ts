interface PublicKeyStorageSave {
	// key
	k: string;

	// Room ID
	r: string;
}

export namespace PublicKeyStorage {
	const localStorageKey = "publicKey";

	export function getPublicKey(): PublicKeyStorageSave | null {
		const d = localStorage.getItem(localStorageKey);
		return d ? JSON.parse(d) : null;
	}

	export function setPublicKey(publicKey: string, roomId: string) {
		const d: PublicKeyStorageSave = {
			k: publicKey,
			r: roomId,
		};

		localStorage.setItem(localStorageKey, JSON.stringify(d));
	}

	export function getPublicKeyAndVerifyRoomId(roomId: string): string | null {
		const d = getPublicKey();
		if (d && d.r === roomId) {
			return d.k;
		}
		return null;
	}
}
