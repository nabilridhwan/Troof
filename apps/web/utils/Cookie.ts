/** @format */

import { deleteCookie, getCookie, setCookie } from "cookies-next";

export namespace Cookie {
	enum CookieKeys {
		PlayerId = "player_id",
		RoomId = "room_id",
		Token = "token",
	}

	export function setPlayerID(player_id: string) {
		setCookie(CookieKeys.PlayerId, player_id);
		return;
	}

	export function getPlayerID(): string | null {
		const c = getCookie(CookieKeys.PlayerId);

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removePlayerID() {
		deleteCookie(CookieKeys.PlayerId);
		return;
	}

	export function setRoomID(room_id: string) {
		setCookie(CookieKeys.RoomId, room_id);
		return;
	}

	export function getRoomId(): string | null {
		const c = getCookie(CookieKeys.RoomId);

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removeRoomId() {
		deleteCookie(CookieKeys.RoomId);
		return;
	}

	export function setToken(token: string) {
		setCookie(CookieKeys.Token, token);
		return;
	}

	export function getToken(): string | null {
		const c = getCookie(CookieKeys.Token);

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removeToken() {
		deleteCookie(CookieKeys.Token);
		return;
	}
}
