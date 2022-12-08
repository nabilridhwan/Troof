/**
 * @format
 * @type {import('next').NextConfig}
 */

const withTM = require("next-transpile-modules")(["@troof/gifpicker"]);

const nextConfig = withTM({
	reactStrictMode: false,
	swcMinify: true,
});

module.exports = nextConfig;
