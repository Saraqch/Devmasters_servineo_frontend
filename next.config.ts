import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /*
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
*/
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",

      },
      {
        protocol: 'https',
        hostname: 'mi-cdn.com',
        pathname: '/**',
      },
     {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",

      },
      {
        protocol: "https",
        hostname: "ejemplo.com",
        pathname: "/**",

      },

    ],
  },
};

export default withNextIntl(nextConfig);