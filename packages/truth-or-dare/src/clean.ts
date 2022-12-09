import { logger } from "@troof/logger";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { Template } from "./allGenerator";

interface CleanTruthOrDareOptions {
	fileEnding: "\n" | "\r\n";
	template: Template;
	preserveExisting: boolean;
}

export default async function CleanTruthOrDareData(
	srcTextFileDir: string,
	outputDirString: string,
	options: CleanTruthOrDareOptions
) {
	const srcDir = path.resolve(srcTextFileDir);
	const outputDir = path.resolve(outputDirString);

	logger.info(`Getting files in ${srcDir}...`);

	const data = await fs.readdir(srcDir);

	// This contains the directory of the text files
	let filteredTextFiles = data.filter((file) => file.endsWith(".txt"));

	if (options.preserveExisting) {
		logger.info(
			"Preserved existing files enabled. Filtering out non existing files to work on..."
		);
		// Filtered text files would exclude items that are already in the output folder
		const outputDirFiles = await fs.readdir(outputDir);

		const changedOutputDirFiles = outputDirFiles.map((file) => {
			const fileName = file.replace(".json", ".txt");
			return fileName;
		});

		filteredTextFiles = filteredTextFiles.filter(
			(file) => !changedOutputDirFiles.includes(file)
		);
		logger.info(
			`Done filtering out non existing files. ${filteredTextFiles.length} files left to work on.`
		);

		if (filteredTextFiles.length === 0) {
			logger.error("No files left to work on. Exiting...");
			return;
		}
	}

	logger.info(`Reading each file in ${srcDir}...`);

	const allTextData = await Promise.all(
		filteredTextFiles.map((textFileDir) => {
			const fullFilePath = path.resolve(srcDir, textFileDir);
			return fs.readFile(fullFilePath, "utf-8");
		})
	);

	logger.info("Done reading files.");

	// Remove every file in the output folder
	logger.info("Removing all items in output folder");
	// Check if the folder exists, if not, create it
	if (!(await fs.stat(outputDir).catch(() => false))) {
		await fs.mkdir(outputDir);
	}

	await fs.readdir(outputDir).then(async (files) => {
		await Promise.all(
			files.map(async (file) => {
				const filePath = path.resolve(outputDir, file);
				await fs.unlink(filePath);
			})
		);
	});
	logger.info("Done removing files in output folder.");

	logger.info("Writing files to output folder...");

	let total = 0;
	const write = allTextData.map((file, index) => {
		const splittedContentByLine: string[] = file.split(options.fileEnding);
		total += splittedContentByLine.length;

		const filePath = path.resolve(
			outputDir,
			filteredTextFiles[index] + ".json"
		);
		const cleanedFilePath = filePath.replace(".txt", "");

		// Get the file name and last letter to assign it to template
		const fileName = filteredTextFiles[index].replace(".txt", "");
		const lastLetter = fileName[fileName.length - 1];

		const properMappedData = splittedContentByLine.map((line) => {
			return {
				id: uuid(),
				type: options.template[lastLetter].name,
				data: line,
				batch_name: fileName,
			};
		});

		logger.info(`[FOUND AND WRITING] ${cleanedFilePath}`);

		fs.writeFile(cleanedFilePath, JSON.stringify(properMappedData), {
			encoding: "utf-8",
			flag: "w",
		});

		return splittedContentByLine;
	});

	logger.info(`Done. Total Truths and Dares:${total}`);
}
