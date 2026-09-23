import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Integration specs self-skip when DATABASE_URL is unset (see src/test/db.ts).
    //
    // Files run sequentially because three of them (auth.router, yoga,
    // health.router) share a single Postgres and TRUNCATE every table in their
    // `beforeEach`. Run in parallel -- Vitest's default -- one file wipes the
    // tables while another is mid-scenario, and the second fails with a 500
    // where it expected its own fixtures. That raced into a red build on `main`
    // and blocked a deploy on 2026-09-23. The suite is small enough that
    // serialising files costs a couple of seconds.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/test/**', 'src/index.ts', 'src/types/**'],
    },
  },
});
