import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@troof/helpers": path.resolve(
				__dirname,
				"packages/helpers/src/index.ts"
			),
			"@troof/helpers/server": path.resolve(
				__dirname,
				"packages/helpers/src/server.ts"
			),
			"@troof/jwt": path.resolve(__dirname, "packages/jwt/index.ts"),
			"@troof/logger": path.resolve(__dirname, "packages/logger/src/index.ts"),
			"@troof/responses": path.resolve(
				__dirname,
				"packages/responses/index.ts"
			),
			"@troof/socket": path.resolve(__dirname, "packages/socket/index.ts"),
		},
	},
	test: {
		environment: "node",
		include: ["apps/services/**/*.test.ts"],
		clearMocks: true,
		restoreMocks: true,
	},
});
