/**
 * @format
 * @type {import('next').NextConfig}
 */

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
	reactStrictMode: false,
});

module.exports = nextConfig;
