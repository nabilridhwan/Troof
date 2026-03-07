"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.MorganStreamer = void 0;
const winston_1 = __importDefault(require("./winston"));
exports.logger = winston_1.default;
class MorganStreamer {
    write(text) {
        winston_1.default.info(text.replace(/\n$/, ""));
    }
}
exports.MorganStreamer = MorganStreamer;
//# sourceMappingURL=index.js.map