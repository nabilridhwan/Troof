/**
 * @format
 * @type {import('next').NextConfig}
 */

const withTM = require("next-transpile-modules")(["@troof/gifpicker"]);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer(
	withTM({
		reactStrictMode: false,
		swcMinify: true,
	})
);

module.exports = nextConfig;
