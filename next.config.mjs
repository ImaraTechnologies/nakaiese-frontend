import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**', // CHANGED: Allow ALL paths (fixes the /api/v1/... mismatch)
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', 
        port: '8000',
        pathname: '/**', // CHANGED: Same here
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactCompiler: true,
};

export default withNextIntl(nextConfig);