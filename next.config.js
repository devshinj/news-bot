/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProduction ? '/news-bot' : '',
  assetPrefix: isProduction ? '/news-bot/' : '',
};

module.exports = nextConfig;
