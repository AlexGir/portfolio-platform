import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from './umami';

afterEach(() => {
  delete window.umami;
});

describe('trackEvent', () => {
  it('forwards the event and its properties to Umami', () => {
    const track = vi.fn();
    window.umami = { track };

    trackEvent('cv-ouvert', { source: 'hero' });

    expect(track).toHaveBeenCalledWith('cv-ouvert', { source: 'hero' });
  });

  it('does nothing when Umami is absent — blocked script or local dev', () => {
    expect(() => trackEvent('cv-ouvert')).not.toThrow();
  });

  it('swallows a tracker error rather than surfacing it to the visitor', () => {
    window.umami = {
      track: () => {
        throw new Error('tracker en vrac');
      },
    };

    expect(() => trackEvent('cv-ouvert')).not.toThrow();
  });
});
