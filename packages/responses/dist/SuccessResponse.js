"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseResponse_1 = __importDefault(require("./BaseResponse"));
class SuccessResponse extends BaseResponse_1.default {
    constructor(message, data) {
        super(200, message, data);
    }
}
exports.default = SuccessResponse;
