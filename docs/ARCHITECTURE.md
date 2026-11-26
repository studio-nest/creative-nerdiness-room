# Architecture

## Goals that shaped it

1. A complete, working room beats an ambitious unfinished one.
2. Content must be editable without touching rendering code.
3. Usability first: everything reachable by keyboard, touch and without WebGL.
4. No asset pipeline to break: the scene is built from code.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript | Required; strict mode on |
| 3D | three.js via React Three Fiber 9 | Declarative scene, component reuse |
| Camera | `camera-controls` (through drei's `CameraControls`) | Smooth damped transitions, touch/pinch, orbit limits, focal offset |
| State | Zustand | One tiny store readable from both React and the render loop without re-renders |
| Build | Vite 8 | Fast dev, code-splitting |
| Tests | Vitest + Testing Library (jsdom) | Unit + UI behaviour |
| Fonts | Fraunces + Nunito via Fontsource | Self-hosted, no third-party requests |

## Layers

```
src/
  content/   What the room says and where things are (pure data + types)
  state/     useRoomStore: focus, hover, day/night, view, readiness, fallback
  lib/       Pure helpers and hooks: camera maths, keyboard map, hash sync, WebGL check
  scene/     Everything inside the <Canvas>
    stations/  One component per station kind + registry (kind → component)
    props/     Non-station objects: lamp, cat, plants
  ui/        DOM overlay: welcome, HUD, dock, panel, hotspots, list view, toast
  styles/    One global stylesheet
```

Dependencies point one way: `content` ← `state`/`lib` ← `scene` and `ui`. `scene` and `ui` only meet in `App.tsx` and through the store, with one small exception (`scene/hotspots.ts`, below).

## Data-driven content

`content/room.ts` exports a `RoomContent` object. A station carries its copy, accent colour, showcase items, **placement** (position, rotation, hit-box, hotspot anchor) and **camera pose**. The scene maps `station.kind` to a model through `scene/stations/registry.ts`, and `Experience.tsx` simply loops over `stations`. The panel and list view render the same data through `ui/StationContent.tsx`.

## Camera

Poses are authored on a sphere: `target`, `azimuth`, `polar`, `distance`, plus a `designAspect` (the aspect ratio the shot was framed for). `lib/camera.ts#resolveCamera` turns a pose into a concrete camera for the current viewport:

- **Fit:** if the free area is narrower than `designAspect`, or shorter because a bottom sheet is open, the camera is pulled back proportionally (capped).
- **Focal offset:** when the panel is open the camera is shifted sideways (side panel) or downwards (bottom sheet) so the subject sits in the middle of the free area.

`scene/CameraRig.tsx` applies the result with animated `setLookAt` / `setFocalOffset` whenever the active station or viewport changes. Orbit is limited to the open quadrant of the two-walled room; while a station is focused, zoom is limited to a narrow band around the framed distance so the subject cannot leave the visible area.

## Interaction

- `scene/Interactive.tsx#StationGroup` positions a station from data, adds an invisible hit-box for generous touch targets, and wires pointer handlers (hover → store, click → focus; drags longer than 8 px are ignored so orbiting never triggers a click).
- `scene/useStationAnim.ts` gives every station the same inputs each frame — local time, eased `hover` (0–1) and eased `active` (0–1) — and each model decides what to do with them. That is where the distinct behaviours come from (swatch fan spreading, brush painting, flash popping, book opening, figures hopping, yarn orbiting, wireframe reveal).
- **Hotspots** are DOM buttons (`ui/Hotspots.tsx`) so they get crisp text and CSS transitions. They register their elements in `scene/hotspots.ts`; `scene/HotspotProjector.tsx` projects each anchor to screen space every frame and sets a transform. No React state changes per frame.
- **Keyboard** (`lib/useKeyboardNav.ts`) and **deep links** (`lib/useHashSync.ts`) only talk to the store.

## Illustrated rendering

Three layers turn the 3D scene into something closer to a drawing:

1. **Cel shading.** `scene/ink.ts` defines `InkToonMaterial`, a `MeshToonMaterial` with a shared four-step ramp, registered with R3F as `<inkToonMaterial>`. Every solid surface uses it (the `Box` / `Cyl` / `Ball` primitives apply it automatically), so light falls in flat washes.
2. **Ink outlines.** `scene/InkOutlines.tsx` walks the scene after mount (and re-checks once a second, so late-mounted meshes are covered) and gives each toon-shaded mesh an inflated, back-face-only copy in a dark colour (inverted hull). Shell normals are smoothed so the line stays closed at hard corners; the vertex shader pushes along the view-space normal with a small positional wobble for uneven line weight, and shrinks with the object's scale. Flat decals, transparent meshes, very small details and anything with `userData.ink === false` are skipped.
3. **Paper grain.** A CSS `::after` on the stage multiplies an SVG noise texture over the canvas.

## Decorations

`content/room.ts#decor` lists non-content objects (`kind`, `position`, `rotationY`, `scale`, `variant`). `scene/props/decorRegistry.tsx` maps each kind to a model in `scene/props/Decor.tsx` or `Greenery.tsx`, and `Experience.tsx` loops over the list. Wall-mounted pieces are authored facing +z with their origin on the wall.

## Batching static geometry

The room is built from roughly 1,300 small meshes. Drawn one by one, each with an outline and a shadow, that was about 1,500 draw calls for the overview. Two pieces bring it down:

- **Shared materials** (`scene/materials.ts`). The `Box` / `Cyl` / `Ball` primitives and `<Toon>` take their material from a cache keyed by colour and glow, so identical-looking meshes share one material instance. Animated surfaces (screens, bulbs, the glowing book) keep their own inline `<inkToonMaterial>`; never mutate a cached material.
- **`<Merge>`** (`scene/Merge.tsx`) wraps everything static in `Experience.tsx`. On mount, `batchStatic` groups meshes by *rigid piece* and material, bakes each group into one geometry, adds it as a single mesh, and hides the originals. The originals stay in the scene so React keeps owning them and R3F pointer events still hit them; the batched meshes ignore raycasts.

A rigid piece is the room itself, or anything marked `userData={LIVE}` (its own transform animates: the brush, the bunny, a vine), or each child of something marked `userData={LIVE_CHILDREN}` (the figures, polaroids, yarn balls). Those are batched inside themselves, so they still move as one. Meshes too small for an outline are batched separately with outlines off, matching the outline pass.

**Rule for new code:** anything that moves must be marked, or it gets frozen into the static batch. `?nomerge` in the URL (dev only) turns batching off for comparison.

## Day / night

`scene/Lighting.tsx` eases a single shared number (`env.night`, 0→1) each frame. Lights, the window sky, fairy lights, screens and the lamp read it in their own `useFrame`. The page background cross-fades with CSS.

## Loading and failure

- The scene (`scene/Experience.tsx`, with three.js) is a lazy chunk. The welcome screen shows while it downloads and until the first frames render, then enables "Step inside". A timer fallback covers background tabs where no animation frame arrives.
- `isWebGLAvailable()` is checked up front. An `ErrorBoundary` wraps the lazy scene (covers chunk-load and render errors). A `webglcontextlost` listener covers GPU resets. All three call `fallBackToList(reason)`, which shows the list view with an explanation.
- The list view is also a user choice, available from the welcome screen and the HUD.

## Performance

- Code-built geometry only: a few hundred small meshes, no texture downloads; canvas textures are created once and disposed on unmount.
- Three quality tiers in the store: **high** (shadows + outlines, DPR ≤ 1.75), **medium** (outlines only, DPR ≤ 1.5), **low** (neither, DPR ≤ 1.25). drei's `PerformanceMonitor` steps down one tier each time the frame rate declines; small touch devices start at medium.
- Shadows and outlines are skipped for tiny objects, where they cost a draw call and cannot be seen.
- Static geometry is batched (see above).
- One shadow-casting light (2048² map). Night lighting adds a single point light.
- Per-frame work avoids React: animations mutate refs; the CRT game redraws a 64×48 canvas at ~12 fps.
- The canvas is unmounted entirely in list view.
- Measured on the development laptop at an ~600×800 viewport, quality forced to high:

  | View | Before batching | After |
  | --- | --- | --- |
  | Overview | 1,498 | 701 (386 at medium) |
  | Design close-up | 899 | 459 |
  | Games close-up | 526 | 306 |
  | Crochet close-up | 704 | 346 |

  ~120 fps either way on that machine; the point is headroom on phones. Initial JS ≈ 78 kB gzip; scene chunk ≈ 274 kB gzip.

Remaining headroom: about 120 animated pieces are still drawn one by one (vine leaves, figures, books that wiggle); instancing them would help, as would switch to `frameloop="demand"` when idle under reduced motion.

## Testing

| File | Covers |
| --- | --- |
| `content/content.test.ts` | Content integrity: ids, copy, links, alt text, model registered per station and decor kind, placements in bounds, camera poses within orbit limits |
| `lib/camera.test.ts` | Spherical conversion, fit factor, layout breakpoint, focal offsets, degenerate viewport |
| `scene/Merge.test.ts` | Batching: shared-material meshes merge in place, lone meshes and transparent/non-toon materials are left alone, LIVE and LIVE_CHILDREN pieces batch inside themselves, undo restores the originals |
| `state/useRoomStore.test.ts` | Focus, tour wrap-around, hover reset, mode toggle, fallback, toasts |
| `ui/ui.test.tsx` | Full app around a stubbed scene: welcome gating, dock, panel focus management, keyboard tour, HUD toggles, list view, deep links, no-WebGL fallback |

The 3D layer itself is verified manually in a browser (see the dev log).
