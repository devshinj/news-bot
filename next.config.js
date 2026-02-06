/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel에서는 output: 'export' 불필요 (서버리스 함수 사용)
  images: { unoptimized: true },
};

module.exports = nextConfig;
