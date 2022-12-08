import { createLogger, format, transports } from "winston";

const logLevels = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
	trace: 5,
};

const { printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
	levels: logLevels,
	format: format.combine(format.timestamp(), format.colorize(), customFormat),
	transports: [
		new transports.Console(),
		// new transports.File({
		// 	filename: "combined.log",
		// 	format: format.combine(
		// 		format.timestamp(),
		// 		format.uncolorize(),
		// 		format.json()
		// 	),
		// }),
	],
});

export default logger;
