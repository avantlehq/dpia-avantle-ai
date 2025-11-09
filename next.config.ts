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
  }
};

export default withNextIntl(nextConfig);
