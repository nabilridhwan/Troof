import { getCookie, setCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

type Req = NextApiRequest | IncomingMessage | undefined;
type Res = NextApiResponse | ServerResponse | undefined;

export namespace Cookie {
	export function setPlayerID(player_id: string, req: Req, res: Res) {
		setCookie("player_id", player_id, {
			req,
			res,
		});
		return;
	}

	export function getPlayerID(req: Req, res: Res): string | null {
		const c = getCookie("player_id", {
			req,
			res,
		});

		if (!c) {
			return null;
		}

		return c.toString();
	}
}
