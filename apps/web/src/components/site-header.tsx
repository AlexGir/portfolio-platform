'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from './ui/container';
import { ThemeToggle } from './theme-toggle';
import { profile } from '@/content/profile';

/**
 * Work comes first: a recruiter landing here should reach a case study before
 * anything else. `/login` is intentionally absent — the private dashboard is
 * not for visitors, and the route stays reachable by URL.
 */
const NAV = [
  { href: '/#work', label: 'Projets' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/#about', label: 'À propos' },
  { href: '/#contact', label: 'Contact' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-rule bg-bg/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg tracking-tight whitespace-nowrap">
          alex<span className="text-accent-text italic dark:text-accent">.productDesigner</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="eyebrow text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.resume.href}
            target="_blank"
            rel="noreferrer"
            className="eyebrow bg-accent-strong px-3.5 py-2 text-accent-fg transition-transform duration-200 hover:-translate-y-0.5"
          >
            CV ↗
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          >
            <span aria-hidden="true">{open ? '✕' : '☰'}</span>
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Navigation mobile"
          className="border-t border-border md:hidden"
        >
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={profile.resume.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-accent"
            >
              Voir mon CV ↗
            </a>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
