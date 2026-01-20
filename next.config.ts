import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from "next";
import path from 'path'

// CRITICAL: Must specify exact path to i18n request file (v3.31.9)
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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
