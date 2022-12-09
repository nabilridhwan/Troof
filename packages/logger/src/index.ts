import logger from "./winston";

export class MorganStreamer {
	write(text: string) {
		logger.info(text.replace(/\n$/, ""));
	}
}

export { logger };
