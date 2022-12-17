import { logger } from "@troof/logger";
import { BadRequest } from "@troof/responses";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";

export default function VerifyCaptcha(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return async function (headerKey: string) {
		const CaptchaTokenSchema = z.object({
			[headerKey]: z.string(),
		});

		try {
			CaptchaTokenSchema.parse(req.headers);

			logger.info(`Found captcha token of key ${headerKey} in headers`);

			const captchaToken = req.headers[headerKey];

			console.log(captchaToken);

			// Verify the reCaptcha token
			const recaptchaRes = await axios.post(
				"https://www.google.com/recaptcha/api/siteverify",
				{},
				{
					params: {
						secret: process.env.RECAPTCHA_SECRET,
						response: captchaToken,
					},
				}
			);

			if (!recaptchaRes.data.success) {
				logger.error("Invalid reCaptcha request");
				return new BadRequest(
					"Invalid reCaptcha request, please try again later.",
					{}
				).handleResponse(req, res);
			}

			// if everything is fine, call next
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const e = error.flatten((issue: ZodIssue) => ({
					message: issue.message,
					error: issue.code,
				}));

				return new BadRequest(
					"Invalid reCaptcha request, please try again later.",
					e
				).handleResponse(req, res);
			}
		}
	};
}
