"use strict";
// https://github.com/ark-maker-bot/better-tord/blob/main/index.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_dare = exports.get_truth = void 0;
// Read file from truth or dare generator
const all_dares_json_1 = __importDefault(require("@troof/truth-or-dare-generator/output/all_dares.json"));
const all_truths_json_1 = __importDefault(require("@troof/truth-or-dare-generator/output/all_truths.json"));
const make_random_1 = require("make-random");
function get_truth() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting truth...");
        const randomNum = yield (0, make_random_1.randomInRange)(0, all_truths_json_1.default.length);
        console.log(`[TRUTH] Random number: ${randomNum}`);
        return all_truths_json_1.default[randomNum];
    });
}
exports.get_truth = get_truth;
function get_dare() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting dare...");
        const randomNum = yield (0, make_random_1.randomInRange)(0, all_dares_json_1.default.length);
        console.log(`[DARE] Random number: ${randomNum}`);
        return all_dares_json_1.default[randomNum];
    });
}
exports.get_dare = get_dare;
