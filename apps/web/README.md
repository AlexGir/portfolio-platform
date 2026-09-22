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
    work/                /work index + /work/[slug] case study template
  components/
    site-header.tsx      sticky nav + mobile menu (client)
    site-footer.tsx
    theme-script.tsx     pre-paint dark-mode class (no FOUC)
    theme-toggle.tsx     client toggle, persisted in localStorage
    ui/                  Container, Section
    sections/            Hero, About, Expertise, Work, Contact
    case-study/          cover art, meta grid, process step, decision table,
                         board figure, impact grid, prev/next nav
  content/               profile.ts, expertise.ts, case-studies.ts — edit these
  lib/
    env.ts               NEXT_PUBLIC_API_URL
    api.ts               fetch wrapper (credentials, bearer, ApiError)
    auth-context.tsx     client session: refresh cookie → access token + user
scripts/
  capture-boards.mts     renders each design board to a PNG (Playwright)
public/
  planches/              design boards: one .html + its rendered .png
  cv-*.pdf               the CV linked from the header, hero, contact and footer
e2e/                     Playwright specs (landing, auth entry points, work)
```

## Content

All personal content lives in `src/content/`. Nothing on the page is fetched or
generated at runtime.

### Design boards

Case studies embed design boards from `public/planches/`. Each board is a
self-contained HTML document on a fixed 1800×1069 canvas, with a PNG rendered
next to it that the page actually displays — an `<img>` always renders, whereas
an iframe gets blocked by ad blockers and privacy modes. The HTML stays the
"open full size" target.

After adding or editing a board, re-render the previews:

```bash
pnpm --filter @portfolio/web boards:capture
```

A unit test fails if a referenced board is missing either file, so a forgotten
capture cannot reach production.

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
pnpm --filter @portfolio/web boards:capture   # re-render the design board PNGs
```

The e2e build sets `NEXT_OUTPUT_STANDALONE=false`: the standalone bundle is only
needed for the Docker image (CI builds it in a separate job) and producing it
fails on Windows + pnpm with an `EPERM` symlink error.
