import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@portfolio/shared'],
  typedRoutes: true,
  // Self-contained server bundle for the Docker image (see infra/docker/web.Dockerfile).
  // Only the image needs it, and producing it fails on Windows + pnpm (EPERM on
  // symlink), so the e2e build opts out — otherwise the suite cannot run locally.
  output: process.env.NEXT_OUTPUT_STANDALONE === 'false' ? undefined : 'standalone',
  // Linting is run separately (`pnpm lint` via Turbo) with the repo's flat config.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
