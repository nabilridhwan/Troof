import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		seed: "npm run seed:truth-dare",
		path: "packages/database/prisma/migrations",
	},
	datasource: {
		// In Prisma 7, datasource URLs are configured here instead of schema.prisma.
		url: process.env.DATABASE_URL ?? "",
	},
});
