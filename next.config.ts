import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail**',
      },
      {
        protocol: 'https',
        hostname: 'mi-cdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
