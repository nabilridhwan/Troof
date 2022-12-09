// https://github.com/ark-maker-bot/better-tord/blob/main/index.js

// Read file from truth or dare generator
import all_dares from "@troof/truth-or-dare/output/all_dare.json";
import all_truths from "@troof/truth-or-dare/output/all_truth.json";

import { randomInRange } from "make-random";

export async function get_truth() {
	console.log("Getting truth...");
	const randomNum = await randomInRange(0, all_truths.length);
	console.log(`[TRUTH] Random number: ${randomNum}`);
	return all_truths[randomNum].data;
}
export async function get_dare() {
	console.log("Getting dare...");
	const randomNum = await randomInRange(0, all_dares.length);

	console.log(`[DARE] Random number: ${randomNum}`);
	return all_dares[randomNum].data;
}
