import path from "path";
// This file generates the `all_truths.json` and `all_dares.json` files. It will read each output json file and determine the last letter before .json. If it is a D, it will be dares, if it is a T, it will be truths. It will then add the contents of the file to the all_truths.json or all_dares.json file. This is done so that the user can select a random truth or dare from the entire list of truths and dares.

// Path: truth_or_dare_generator\allGenerator.ts

import logger from "@troof/logger";
import fs from "fs/promises";

const dares: string[] = [];
const truths: string[] = [];

type CollectorInterface = {
	[key: Template[keyof Template]["name"]]: string[];
};

const collector: CollectorInterface = {};

/**
 * The template for the JSON files
 * key: The ending of the latter of what the file is. For example, if the file is full of dares, the key will be D. If the file is full of truths, the key will be T.
 *
 * name: The category.
 *
 * @interface Template
 */
interface Template {
	[key: string]: {
		name: string;
	};
}

export default async function generateAllData(
	srcJsonFileDir: string,
	outputDirString: string,
	template: Template
) {
	const srcDir = path.resolve(srcJsonFileDir);
	const outputDir = path.resolve(outputDirString);

	logger.info("Reading files in output folder...");

	const data = await fs.readdir(srcDir);

	const filteredJsonFiles = data.filter((file) => file.endsWith(".json"));

	const allJsonFileData = await Promise.all(
		filteredJsonFiles.map(async (file) => {
			const p = path.resolve(srcDir, file);
			return fs.readFile(p, "utf-8");
		})
	);

	let total = 0;
	const writeAllFiles = allJsonFileData.map((file, index) => {
		const j = JSON.parse(file);

		const fileName = filteredJsonFiles[index].replace(".json", "");
		// Check the last letter if D or T
		const lastLetter = fileName[fileName.length - 1];

		if (template[lastLetter]) {
			// Collector is available

			const name = template[lastLetter].name;
			const currentItemsInCollector = collector[name] || [];

			collector[name] = [...currentItemsInCollector, ...j];
			logger.info(`[WRITTEN] [${name.toUpperCase()}] ${fileName}`);
		}
	});

	// Wait for Promise.all to finish
	await Promise.all(writeAllFiles);

	// Remove duplicates
	// Unique collector items
	const uniqueCollector: CollectorInterface = {};

	Object.keys(collector).forEach((key) => {
		uniqueCollector[key] = [...new Set(collector[key])];
	});

	// Write the files
	Object.keys(uniqueCollector).forEach(async (key) => {
		await fs.writeFile(
			path.resolve(outputDir, `all_${key}.json`),
			JSON.stringify(uniqueCollector[key]),
			{
				encoding: "utf-8",
				flag: "w",
			}
		);
	});

	logger.info("Done.");

	Object.keys(uniqueCollector).forEach((key) => {
		logger.warn(
			`[STATS] Filtered out ${
				collector[key].length - uniqueCollector[key].length
			} duplicate ${key.toUpperCase()}.`
		);
		logger.info(
			`[STATS] Total ${key.toUpperCase()}: ${uniqueCollector[key].length}`
		);
	});
}
