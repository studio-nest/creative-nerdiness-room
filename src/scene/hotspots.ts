/**
 * Bridge between the DOM hotspot buttons (src/ui/Hotspots) and the canvas:
 * the UI registers its elements here, the scene moves them every frame.
 */
export const hotspotElements = new Map<string, HTMLElement>();
