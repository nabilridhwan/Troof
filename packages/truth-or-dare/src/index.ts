import generateAllData from "./allGenerator";
import cleanTruthOrDareData from "./clean";

(async () => {
	console.log("==============================");
	await cleanTruthOrDareData("textfiles", "output");
	console.log("==============================");
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
