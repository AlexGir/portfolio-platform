# @portfolio/web

Next.js (App Router) web app: the public portfolio and the authenticated
dashboard.

## Layout

```
src/
  app/
    layout.tsx           root layout, ThemeScript, AuthProvider
    page.tsx             portfolio landing (hero / about / expertise / work / contact)
    login/               provider buttons → API OAuth endpoints
    auth/callback/        exchanges the refresh cookie for a session, then → /dashboard
    dashboard/           authenticated area (client-guarded for now)
    not-found.tsx
  components/
    site-header.tsx      sticky nav + mobile menu (client)
    site-footer.tsx
    theme-script.tsx     pre-paint dark-mode class (no FOUC)
    theme-toggle.tsx     client toggle, persisted in localStorage
    ui/                  Container, Section
    sections/            Hero, About, Expertise, Work, Contact
  content/               profile.ts, expertise.ts, projects.ts — edit these
  lib/
    env.ts               NEXT_PUBLIC_API_URL
    api.ts               fetch wrapper (credentials, bearer, ApiError)
    auth-context.tsx     client session: refresh cookie → access token + user
e2e/                     Playwright specs (landing, auth entry points)
```

## Content

All personal content lives in `src/content/`. `profile.ts` has a `TODO` for the
full name. Nothing on the page is fetched or generated.

## Auth flow (web side)

1. `/login` → link to `${NEXT_PUBLIC_API_URL}/auth/:provider`.
2. API completes OAuth, sets the `HttpOnly` refresh cookie, redirects to `/auth/callback`.
3. `/auth/callback` calls `POST /auth/refresh` (cookie) → access token in memory
   (`AuthProvider`), then routes to `/dashboard`.
4. `AuthProvider` also runs a silent refresh on load to restore a session.

The dashboard guard is client-side; the API remains the real authority (every
protected endpoint verifies the bearer token).

## Commands

```bash
pnpm --filter @portfolio/web dev        # http://localhost:3000
pnpm --filter @portfolio/web test       # Vitest + Testing Library
pnpm --filter @portfolio/web e2e:install
pnpm --filter @portfolio/web e2e        # Playwright (builds + starts on :3100)
```
