import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@portfolio/shared'],
  typedRoutes: true,
  // Self-contained server bundle for the Docker image (see infra/docker/web.Dockerfile).
  output: 'standalone',
  // Linting is run separately (`pnpm lint` via Turbo) with the repo's flat config.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
