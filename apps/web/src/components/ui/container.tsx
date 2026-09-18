import type { ReactNode } from 'react';

/** Centres content with the site's max width and horizontal padding. */
export function Container({
  children,
  className = '',
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  /** Use the narrower reading-column width (long-form text). */
  narrow?: boolean;
}) {
  const maxWidth = narrow ? 'max-w-3xl' : 'max-w-5xl';
  return <div className={`mx-auto w-full ${maxWidth} px-6 ${className}`}>{children}</div>;
}
