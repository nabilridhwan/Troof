import { logger } from "@troof/logger";
import * as jwt from "jsonwebtoken";

export namespace JWT {
	export function generate(
		payload: any,
		secret: string,
		options?: jwt.SignOptions
	): string | null {
		if (!secret) {
			logger.error("JWT secret is not defined");
			return null;
		}

		return jwt.sign(payload, secret, options);
	}

	export function verify<T>(
		token: string,
		secret: string,
		options?: jwt.VerifyOptions
	): T | null {
		if (!secret) {
			logger.error("JWT secret is not defined");
			return null;
		}

		try {
			const v = jwt.verify(token, secret, options) as T;
			return v;
		} catch (error) {
			logger.error("JWT verify error", error);
			return null;
		}
	}
}
