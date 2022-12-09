import { logger } from "@troof/logger";
import path from "path";
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
const srcPath = path.resolve(__dirname, "..", "textfiles");
const outputPath = path.resolve(__dirname, "..", "output");

async function main() {
	console.log("==============================");
	logger.warn("Cleaning data from textfiles");
	await cleanTruthOrDareData(srcPath, outputPath, {
		fileEnding: "\n",
		template,
		preserveExisting: false,
	});

	console.log("==============================");
	logger.warn("Generating all_xxx.json files");
	await generateAllData(outputPath, outputPath, template);
	console.log("==============================");
	logger.warn("Removing duplicates");
	await removeDuplicates(outputPath, template);
	// console.log("==============================");
	// logger.warn("Writing to database");
	// await writeToDatabase("output");
}

main();

// export { get_truth, get_dare };
