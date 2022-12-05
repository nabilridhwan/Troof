import { getCookie, setCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

type Req = NextApiRequest | IncomingMessage | undefined;
type Res = NextApiResponse | ServerResponse | undefined;

enum CookieKeys {
	PlayerId = "player_id",
	RoomId = "room_id",
}

export namespace Cookie {
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
}
