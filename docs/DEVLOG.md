# Development log

## Plan

**Requirements → decisions**

- *Fully interactive 3D room, modular, data-driven* → React Three Fiber scene driven by `content/room.ts`; one component per station kind behind a registry.
- *Smooth camera navigation* → `camera-controls` with authored spherical poses and animated transitions.
- *Desktop, tablet, mobile; keyboard and touch* → DOM overlay with a dock; side panel on wide screens, bottom sheet below 820 px; camera re-fits and re-centres for whichever is open.
- *Loading states and graceful errors* → lazy scene chunk behind a welcome screen; list-view fallback for no WebGL, crashes and context loss.
- *Performance* → no downloaded assets, capped DPR, adaptive quality, ref-based animation.

**Risks identified up front**

| Risk | Mitigation |
| --- | --- |
| Scope: seven bespoke animated models | Build from primitives; one shared animation hook |
| Asset pipeline (models/textures) failing or bloating | No external assets; canvas-painted textures |
| Camera framing breaking on portrait screens | Pure, unit-tested `resolveCamera` with fit + focal offset |
| 3D being inaccessible | Dock + list view carry all content; focus management; live region |
| Orbit drags being read as clicks | Ignore clicks whose pointer travelled > 8 px |

**Roadmap followed:** scaffold → content/state/camera maths → scene shell → stations → UI → tests → browser verification → responsive pass → docs.

## What was verified in the browser

Chromium-based browser, dev server.

- Welcome screen gates entry until the scene has drawn; "Browse as a list" works before entering.
- Clicking an object on the canvas focuses it; hotspots and dock buttons do the same.
- Keyboard: arrows, `1`–`7`, `Esc`, `N`, `L`. Focus moves to the panel heading and returns to the dock button on close.
- All seven stations framed correctly beside the panel at 800×600, 768×1024 and 375×812.
- Day/night from the HUD, the `N` key and by clicking the lamp.
- Poking the cat shows a toast.
- Dragging orbits without triggering clicks; orbit stays inside the open side of the room.
- Deep link `/#/stories` opens that station after entering.
- List view ↔ 3D room round trip.
- Fresh-tab console: no errors (only three.js deprecation warnings from R3F).

Not verified: real touch hardware, Safari, Firefox, a full screen-reader pass, slow devices, forced `prefers-reduced-motion` (implemented, exercised only through code paths).

## Bugs found and fixed along the way

1. **One hotspot never appeared.** Hotspots first used drei's `<Html>`, which mounts a separate React root per label; under StrictMode one of seven was lost and React logged unmount-race errors. Replaced with plain DOM buttons positioned by a per-frame projector.
2. **Tripod legs splayed inward.** Rotation signs were inverted.
3. **Switching to list view locked the app in fallback mode.** Unmounting the canvas disposes the renderer, which fires `webglcontextlost`; the handler treated that as a failure. It now ignores losses that happen after unmount.
4. **Zooming while focused could push the subject off-screen** (the focal offset is computed for the framed distance). Zoom is now limited to 0.8×–1.35× of that distance while a station is focused.
5. **Foreground clutter on phones.** In portrait the camera sits much further back, so a free-standing pedestal in the middle of the floor blocked other stations. Moved it against the wall, swapped places with the lamp, and moved the beanbag.
6. **The cat could not be clicked.** The crochet corner's hit-box sat between it and the camera. Shrunk the hit-box and moved the cat.
7. **Orbit limits let the camera see behind the walls.** Tightened azimuth and polar limits; a test now asserts every authored pose is inside them.
8. **Welcome screen could stall in a background tab** (no animation frames). Added a timer fallback after the renderer is created.
9. **Primary button contrast** was about 4.2:1; darkened the terracotta to pass 4.5:1.
10. **Tooling:** Vitest 3 bundled a different Vite than the app (type conflict in `vite.config.ts`); upgraded to Vitest 5.

## Second pass: illustrated restyle and decorations

Brief: adapt the props from a reference illustration (annotated layout) into the existing room, keep all content, make it fuller and more hand-drawn.

**Done**

- Rendering: cel-shaded `InkToonMaterial` everywhere, inverted-hull ink outlines, paper grain overlay, warmer floor and paler walls, lavender rug.
- Props adapted from the reference: nón lá on the wall, little figure and trailing vine on the bookshelf, guitar (clickable), yarn basket (already there), big-leafed floor plant, hanging pothos, wall shelf of books with a vine (stands in for the loft bookshelf / kitchen vine), pegboard, corkboard, drawing tablet and laptop on the desk, crayon drawing, yellow beanbag with sketchbook, sage reading-nook beanbag with pillow and book, letter tray, window with treetops and sill plants, potted citrus tree (stands in for the kitchen tree), book stacks, botanical prints.
- Not built: the loft, kitchen and shower as rooms.
- Decorations are data (`decor` in `room.ts`) behind a registry, like stations.

**Verified in the browser:** overview and three station close-ups (design, stories, photography) with the new look; hotspots, dock and panel still work; fresh console has no errors.

**Not verified:** the final small tweaks (plant veins, smaller hat, shadow/outline trimming, dimmer night fill) and the night scene after its transition finished — the app window went to the background and stopped rendering frames, so screenshots and frame-rate readings were no longer trustworthy. The guitar click was not confirmed for the same reason.

**Cost:** draw calls went from an unmeasured few hundred to ~1,780; trimming shadows/outlines on tiny objects brought the overview to ~1,500. Added a three-tier quality ladder to compensate. Merging static geometry is the real fix and is on the roadmap.

## Notes

- Subagents were not used; the work was sequential and tightly coupled, so a single thread was more efficient.
- Not under version control yet (`git init` when ready; `.gitignore` is in place).
