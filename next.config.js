const withBuilderDevTools = require("@builder.io/dev-tools/next")();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "cdn.builder.io"],
  },
});

module.exports = nextConfig;
