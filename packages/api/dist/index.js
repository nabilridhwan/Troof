"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRoom = exports.getPlayer = exports.getRoom = exports.createRoom = exports.axiosInstance = void 0;
const axiosInstance_1 = __importDefault(require("./axiosInstance"));
exports.axiosInstance = axiosInstance_1.default;
const createRoom_1 = __importDefault(require("./createRoom"));
exports.createRoom = createRoom_1.default;
const getPlayer_1 = __importDefault(require("./getPlayer"));
exports.getPlayer = getPlayer_1.default;
const getRoom_1 = __importDefault(require("./getRoom"));
exports.getRoom = getRoom_1.default;
const joinRoom_1 = __importDefault(require("./joinRoom"));
exports.joinRoom = joinRoom_1.default;
