"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const { printf } = winston_1.format;
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    levels: logLevels,
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize(), customFormat),
    transports: [
        new winston_1.transports.Console(),
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
exports.default = logger;
//# sourceMappingURL=winston.js.map