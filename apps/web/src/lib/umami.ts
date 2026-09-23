/**
 * Garde autour du tracker Umami.
 *
 * `window.umami` est absent quand Umami n'est pas configure (developpement
 * local, tests) ou quand un bloqueur a empeche le script de se charger. Rien
 * ici ne doit jamais remonter une erreur a un visiteur : la mesure d'audience
 * est secondaire, le parcours ne l'est pas.
 */
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

export function trackEvent(name: string, data?: Record<string, unknown>): void {
  try {
    window.umami?.track(name, data);
  } catch {
    // Silencieux volontairement.
  }
}
