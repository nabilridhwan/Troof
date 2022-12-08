import logger from "@troof/logger";
import generateAllData from "./allGenerator";
import cleanTruthOrDareData from "./clean";

(async () => {
	console.log("==============================");
	logger.warn("Cleaning data from textfiles");
	await cleanTruthOrDareData("textfiles", "output");
	console.log("==============================");
	logger.warn("Generating all_xxx.json files");
	await generateAllData("output", "output", {
		D: {
			name: "dares",
		},
		T: {
			name: "truths",
		},
		W: {
			name: "would_you_rathers",
		},
	});
	console.log("==============================");
})();
