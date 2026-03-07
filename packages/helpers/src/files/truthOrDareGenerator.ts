import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

const prisma = new PrismaClient();

async function getRandomQuestion(type: "truth" | "dare") {
	const [question] = await prisma.$queryRaw<Array<{ data: string }>>`
		SELECT data
		FROM "question"
		WHERE type = ${type}
			AND available = true
			AND under_review = false
		ORDER BY RANDOM()
		LIMIT 1
	`;

	if (!question) {
		throw new Error(`No available ${type} question found in database`);
	}

	return question.data;
}

export async function get_truth() {
	return getRandomQuestion("truth");
}

export async function get_dare() {
	return getRandomQuestion("dare");
}
