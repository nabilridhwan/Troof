import logger from "@troof/logger";
import fs from "fs/promises";
import path from "path";
import { CollectorInterface, Data, Template } from "./allGenerator";

const uniqueItems: CollectorInterface = {};

export default async function removeDuplicates(
	sourceJsonFileDir: string,
	template: Template
) {
	const srcDir = path.resolve(sourceJsonFileDir);

	// This matches all_xxx.json files
	const allNameMatcher = new RegExp(/^all_(.+)\.json$/);

	const allFileNamesInSourceDir = await fs.readdir(srcDir);

	const allJsonFiles = allFileNamesInSourceDir.filter((file) =>
		allNameMatcher.test(file)
	);

	// All contents of all_xxx.json files
	const allContents = await Promise.all(
		allJsonFiles.map((file) => {
			const fullFilePath = path.resolve(srcDir, file);
			const fileContents = fs.readFile(fullFilePath, "utf-8");
			return fileContents;
		})
	);

	// Loop through all contents and write to database

	allContents.map((content, index) => {
		const allFileJSONContent: Data[] = JSON.parse(content);

		allFileJSONContent.forEach((item) => {
			const type = item.type;

			if (!uniqueItems[type]) {
				uniqueItems[type] = [item];
			} else {
				// If the .data exist in uniqueItems[type] then don't add it
				if (uniqueItems[type].findIndex((i) => i.data === item.data) === -1) {
					uniqueItems[type].push(item);
				}
			}
		});

		// logger.info(`[${}] Found ${json.length} questions.`);
	});

	// Show how many questions were duplicated
	Object.keys(uniqueItems).forEach((key) => {
		const data = uniqueItems[key];
		logger.info(
			`[${key}] Found ${data.length} questions after removing duplicates.`
		);
	});

	// Write to all_xxx.json files
	const writeToAllFiles = Object.keys(uniqueItems).map((key) => {
		const data = uniqueItems[key];
		const fullFilePath = path.resolve(srcDir, `all_${key}.json`);
		const fileContents = fs.writeFile(
			fullFilePath,
			JSON.stringify(data, null, 2),
			"utf-8"
		);

		return fileContents;
	});

	logger.info(`Removing duplicates in all_xxx.json files...`);
	await Promise.all(writeToAllFiles);
	logger.info(`Successfully remove duplicates in all_xxx.json files.`);
}
