/** @format */

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

type Req = NextApiRequest | IncomingMessage | undefined;
type Res = NextApiResponse | ServerResponse | undefined;

export namespace Cookie {
	enum CookieKeys {
		PlayerId = "player_id",
		RoomId = "room_id",
		Token = "token",
	}

	export function setPlayerID(player_id: string, req?: Req, res?: Res) {
		setCookie(CookieKeys.PlayerId, player_id, {
			req,
			res,
		});
		return;
	}

	export function getPlayerID(req?: Req, res?: Res): string | null {
		const c = getCookie(CookieKeys.PlayerId, {
			req,
			res,
		});

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removePlayerID(req?: Req, res?: Res) {
		deleteCookie(CookieKeys.PlayerId, {
			req,
			res,
		});
		return;
	}

	export function setRoomID(room_id: string, req?: Req, res?: Res) {
		setCookie(CookieKeys.RoomId, room_id, {
			req,
			res,
		});
		return;
	}

	export function getRoomId(req?: Req, res?: Res): string | null {
		const c = getCookie(CookieKeys.RoomId, {
			req,
			res,
		});

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removeRoomId(req?: Req, res?: Res) {
		deleteCookie(CookieKeys.RoomId, {
			req,
			res,
		});
		return;
	}

	export function setToken(token: string, req?: Req, res?: Res) {
		setCookie(CookieKeys.Token, token, {
			req,
			res,
		});
		return;
	}

	export function getToken(req?: Req, res?: Res): string | null {
		const c = getCookie(CookieKeys.Token, {
			req,
			res,
		});

		if (!c) {
			return null;
		}

		return c.toString();
	}

	export function removeToken(req?: Req, res?: Res) {
		deleteCookie(CookieKeys.Token, {
			req,
			res,
		});
		return;
	}
}
