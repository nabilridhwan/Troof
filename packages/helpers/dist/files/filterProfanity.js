"use strict";
// This file is for filtering bad words
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_words_1 = __importDefault(require("bad-words"));
const filterProfanity = new bad_words_1.default({ placeHolder: "*" });
const allowedWords = [
    "bitch",
    "bitches",
    "fuck",
    "fucked",
    "fuckers",
    "fucking",
    "fucker",
    "bitched",
    "bitching",
    "ass",
    "hat",
    "hole",
    "asshole",
    "asshat",
];
filterProfanity.removeWords(...allowedWords);
exports.default = filterProfanity;
