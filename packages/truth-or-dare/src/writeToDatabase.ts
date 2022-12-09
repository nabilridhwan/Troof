// import {logger}r}r}r}r}r}r}r}r}r}r}r}r}r} from "@troof/logger";
// import fs from "fs/promises";
// import path from "path";
// import prisma from "./prisma";

// export default async function writeToDatabase(sourceJsonFileDir: string) {
// 	const srcDir = path.resolve(sourceJsonFileDir);

// 	// This matches all_xxx.json files
// 	const allNameMatcher = new RegExp(/^all_(.+)\.json$/);

// 	const allFileNamesInSourceDir = await fs.readdir(srcDir);

// 	const allJsonFiles = allFileNamesInSourceDir.filter((file) =>
// 		allNameMatcher.test(file)
// 	);

// 	// All contents of all_xxx.json files
// 	const allContents = await Promise.all(
// 		allJsonFiles.map((file) => {
// 			const fullFilePath = path.resolve(srcDir, file);

// 			const fileContents = fs.readFile(fullFilePath, "utf-8");
// 			return fileContents;
// 		})
// 	);

// 	// Loop through all contents and write to database

// 	const writeToDatabase = allContents.map((content, index) => {
// 		const json = JSON.parse(content);
// 		logger.info(
// 			`[${allJsonFiles[index]}] Found ${json.length} questions. Writing to database...`
// 		);

// 		// Write to database
// 		return prisma.question.createMany({
// 			data: json,
// 			skipDuplicates: true,
// 		});
// 	});

// 	const dbRes = await Promise.all(writeToDatabase);

// 	dbRes.forEach((res, index) => {
// 		if (res.count === 0) {
// 			logger.info(
// 				`[${allJsonFiles[index]}] All questions written, No questions written to database.`
// 			);
// 		} else {
// 			logger.info(
// 				`[${allJsonFiles[index]}] Successfully written ${res.count} questions to database.)`
// 			);
// 		}
// 	});
// }
