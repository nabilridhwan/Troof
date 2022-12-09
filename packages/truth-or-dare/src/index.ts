import logger from "@troof/logger";
import generateAllData, { Template } from "./allGenerator";
import cleanTruthOrDareData from "./clean";
import removeDuplicates from "./removeDuplicates";

const template: Template = {
	D: {
		name: "dare",
	},
	T: {
		name: "truth",
	},
	W: {
		name: "would_you_rather",
	},
};

async function main() {
	console.log("==============================");
	logger.warn("Cleaning data from textfiles");
	await cleanTruthOrDareData("textfiles", "output", {
		fileEnding: "\n",
		template,
		preserveExisting: false,
	});

	console.log("==============================");
	logger.warn("Generating all_xxx.json files");
	await generateAllData("output", "output", template);
	console.log("==============================");
	logger.warn("Removing duplicates");
	await removeDuplicates("output", template);
	// console.log("==============================");
	// logger.warn("Writing to database");
	// await writeToDatabase("output");
}

main();
