import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function resolveTypeFromFileName(fileName: string): "truth" | "dare" | null {
	const baseName = fileName.replace(/\.txt$/i, "");
	const suffix = baseName[baseName.length - 1]?.toUpperCase();

	if (suffix === "T") {
		return "truth";
	}

	if (suffix === "D") {
		return "dare";
	}

	return null;
}

async function main() {
	const sourceDir = path.resolve(
		process.cwd(),
		"scripts",
		"truth-or-dare",
		"textfiles"
	);
	const files = (await fs.readdir(sourceDir)).filter((file) =>
		file.endsWith(".txt")
	);

	const rows = new Map<
		string,
		{ type: "truth" | "dare"; data: string; batch_name: string }
	>();

	for (const file of files) {
		const type = resolveTypeFromFileName(file);
		if (!type) {
			continue;
		}

		const fullPath = path.resolve(sourceDir, file);
		const content = await fs.readFile(fullPath, "utf-8");
		const lines = content
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		for (const line of lines) {
			const normalizedLine = line.replace(/\s+/g, " ").trim();
			rows.set(normalizedLine, {
				type,
				data: normalizedLine,
				batch_name: file.replace(/\.txt$/i, ""),
			});
		}
	}

	if (rows.size === 0) {
		console.log("No truth/dare rows found to seed.");
		return;
	}

	const data = Array.from(rows.values());
	const result = await prisma.question.createMany({
		data,
		skipDuplicates: true,
	});

	const truthCount = data.filter((row) => row.type === "truth").length;
	const dareCount = data.filter((row) => row.type === "dare").length;

	console.log(
		`Prepared ${data.length} unique rows (${truthCount} truths, ${dareCount} dares).`
	);
	console.log(`Inserted ${result.count} new rows (duplicates skipped).`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
