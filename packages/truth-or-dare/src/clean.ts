import logger from "@troof/logger";
import fs from "fs/promises";
import path from "path";

export default async function cleanTruthOrDareData(
	srcTextFileDir: string,
	outputDirString: string,
	fileEnding: "\n" | "\r\n" = "\r\n"
) {
	const srcDir = path.resolve(srcTextFileDir);
	const outputDir = path.resolve(outputDirString);

	logger.info(`Getting files in ${srcDir}...`);

	const data = await fs.readdir(srcDir);

	// This contains the directory of the text files
	const filteredTextFiles = data.filter((file) => file.endsWith(".txt"));

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
		const splitFile: string[] = file.split(fileEnding);
		total += splitFile.length;

		const filePath = path.resolve(
			outputDir,
			filteredTextFiles[index] + ".json"
		);
		const cleanedFilePath = filePath
			.replace(" ", "-")
			.replace("_", "-")
			.replace(".txt", "");

		logger.info(`[FOUND AND WRITING] ${cleanedFilePath}`);

		fs.writeFile(cleanedFilePath, JSON.stringify(splitFile), {
			encoding: "utf-8",
			flag: "w",
		});

		return splitFile;
	});

	logger.info(`Done. Total Truths and Dares:${total}`);
}
