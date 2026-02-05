/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/news-bot',
  assetPrefix: '/news-bot/',
};

module.exports = nextConfig;
