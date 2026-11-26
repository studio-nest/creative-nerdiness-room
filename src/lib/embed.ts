function detect(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('embed')) return true;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin parents can throw on access; that still means we're framed.
    return true;
  }
}

/**
 * True when the room is shown inside another page (an iframe, or `?embed`).
 * Embedded, the room waits for a click before downloading the 3D scene,
 * lets the page scroll past it, and offers a full-screen link.
 */
export const IS_EMBED = detect();

/** The same room as a standalone page, for the "open full screen" link. */
export function fullScreenUrl(): string {
  const url = new URL(window.location.href);
  url.searchParams.delete('embed');
  return url.toString();
}
