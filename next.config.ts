import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landingPage',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/invoices/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  skipTrailingSlashRedirect: true,
};

// const withNextIntl = createNextIntlPlugin();
// export default withNextIntl(nextConfig);
export default nextConfig;
