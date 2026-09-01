import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@portfolio/shared'],
  typedRoutes: true,
  // Linting is run separately (`pnpm lint` via Turbo) with the repo's flat config.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
