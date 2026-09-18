/** Pull-quote style callout for the "what this confirmed" beat of a case study. */
export function ReflectionCallout({ label, text }: { label: string; text: string }) {
  return (
    <figure className="border-l-2 border-accent py-1 pl-6">
      <p className="eyebrow text-accent">{label}</p>
      <blockquote className="mt-2 font-display text-xl italic text-fg/90 sm:text-2xl">
        “{text}”
      </blockquote>
    </figure>
  );
}
