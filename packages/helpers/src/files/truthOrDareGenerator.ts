import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

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
