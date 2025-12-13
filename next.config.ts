import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from "next";
import path from 'path'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  turbopack: {
    root: path.resolve(__dirname)
  },
  // Skip global-error prerendering to avoid useContext SSR issues
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default withNextIntl(nextConfig);
