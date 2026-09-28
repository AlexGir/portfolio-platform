/**
 * Runs before paint to set the `.dark` class from the saved preference (or the
 * OS setting), avoiding a flash of the wrong theme.
 *
 * No stored preference means the visitor's own system setting wins: someone
 * whose device is in dark mode lands on the dark site. The toggle writes to
 * `localStorage`, and that choice then overrides the system setting for good on
 * that browser.
 */
export function ThemeScript() {
  const script = `(function(){try{var s=localStorage.getItem('theme');var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
