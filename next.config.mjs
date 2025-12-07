import createNextIntlPlugin from 'next-intl/plugin';

// Point this to the request file you just created
const withNextIntl = createNextIntlPlugin(
    './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
