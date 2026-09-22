/** Pull-quote style callout for the "what this confirmed" beat of a case study. */
export function ReflectionCallout({ label, text }: { label: string; text: string }) {
  return (
    <figure className="reveal border-l-4 border-accent py-2 pl-6 sm:pl-10">
      <p className="eyebrow text-accent-text dark:text-accent">{label}</p>
      <blockquote className="display-md mt-4 max-w-3xl font-display italic">“{text}”</blockquote>
    </figure>
  );
}
