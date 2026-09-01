'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from './ui/container';
import { ThemeToggle } from './theme-toggle';

const NAV = [
  { href: '#about', label: 'À propos' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#work', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          alex<span className="text-accent">.dev</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            Espace
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
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
          className="border-t border-border sm:hidden"
        >
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-accent"
            >
              Espace →
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
