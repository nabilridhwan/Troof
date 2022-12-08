// Import ever package in the helpers folder

import filterProfanity from "./files/filterProfanity";
import { generateRoomID, generateUserID } from "./files/generators";
import getContrastYIQ from "./files/getContrastYIQ";
import { RegexHelper } from "./files/regexHelpers";
import stringToColor from "./files/stringToColor";
import { get_dare, get_truth } from "./files/truthOrDareGenerator";

export {
	filterProfanity as filterProfanity,
	generateRoomID,
	generateUserID,
	get_dare,
	get_truth,
	getContrastYIQ,
	RegexHelper,
	stringToColor,
};
