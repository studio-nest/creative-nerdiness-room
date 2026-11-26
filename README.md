# Creative Nerdiness — the creative room

An interactive 3D portfolio: instead of a grid of project cards, visitors wander around a small, warm room where every object stands for something the artist makes or loves — design, illustration, photography, stories, games & anime, crochet, and learning 3D.

Built with React 19, TypeScript, Three.js and React Three Fiber. Everything in the scene is modelled in code and textured with canvas-painted images, so there are no model or image downloads. The room is drawn in an illustrated style: flat cel-shaded colour, uneven ink outlines and a paper grain.

## Quick start

Requires Node 20.19+ (developed on Node 23).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-checks, then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the Vitest suite once |
| `npm run typecheck` | TypeScript only |

## Making it yours

**All copy and layout data lives in [`src/content/room.ts`](src/content/room.ts).** The text and showcase items in there are starter placeholders — replace them with real projects.

- **Artist name, intro, social links:** the `artist` block. Links appear in the list view.
- **A station's text:** `title`, `tagline`, `body`, `note`.
- **Projects:** each station's `items`. Add `href` to make the title a link, and `image` + `imageAlt` (a path under `public/` or a URL) to show a picture.
- **Where things sit / how the camera frames them:** `placement` and `camera` on each station.
- **Decorations** (plants, guitar, nón lá, pegboard, beanbags, book stacks…): the `decor` list. Each entry is a `kind`, a `position` and an optional `rotationY`, `scale` and `variant`, so you can move, duplicate or remove pieces without touching 3D code.
- **What the cat and the guitar say:** `catLines`, `guitarLines`.

The test suite validates this file (unique ids, links, alt text, camera limits), so run `npm test` after editing.

**If you add something that moves**, mark the moving group with `userData={LIVE}` (or `userData={LIVE_CHILDREN}` when each child moves on its own), from `src/scene/Merge.tsx`. Unmarked meshes are batched into the static room on load and will not move.

To add a new kind of decoration: add the `kind` in `src/content/types.ts`, build it in `src/scene/props/`, and register it in `src/scene/props/decorRegistry.tsx`.

To add a whole new station: add a `kind` in `src/content/types.ts`, build a model component in `src/scene/stations/`, register it in `src/scene/stations/registry.ts`, add an icon path in `src/ui/Icon.tsx`, then add the entry to `room.ts`.

## Controls

| Input | Action |
| --- | --- |
| Drag / one finger | Look around |
| Scroll / pinch | Zoom |
| Click or tap an object, hotspot or dock button | Visit a station |
| `←` `→` | Previous / next station |
| `1`–`7` | Jump to a station |
| `Esc` or `Home` | Back to the whole room |
| `N` (or click the lamp) | Day / night |
| Click the cat or the guitar | A small surprise |
| `L` | Toggle the list view |
| Swipe left/right on the panel (touch) | Next / previous station |

Each station has a shareable link, e.g. `/#/crochet`.

## Deployment

`npm run build` produces a fully static site in `dist/`. The build uses relative asset paths (`base: './'`), so it works at a domain root or in a sub-folder without changes.

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** publish the `dist/` folder (for example with the `actions/deploy-pages` workflow).
- **Any static host:** upload the contents of `dist/`.

Routing is hash-based, so no server rewrite rules are needed.

## Accessibility

- Every station is reachable without the 3D canvas: the dock is a real `<nav>` of buttons, and the list view presents the same content as a plain document.
- Opening a station moves focus to its heading; closing returns focus to the dock button it came from. Camera moves and light changes are announced through a live region.
- `prefers-reduced-motion` makes camera moves instant and stops ambient animation.
- If WebGL is unavailable, the scene crashes, or the graphics context is lost, the app switches to the list view and says why.
- Interactive targets are at least 44×44 px.

## Known limitations

- **Placeholder content.** Copy and showcase items are examples; there are no real project images or links yet.
- **Tested in one browser engine.** Verified in a Chromium-based browser at desktop, tablet (768×1024) and phone (375×812) sizes using viewport emulation. Not yet tested on real iOS/Android hardware, Safari or Firefox.
- **No automated tests of the 3D layer.** Unit and UI tests stub the canvas; the scene itself was checked by hand.
- **Performance measured on one machine only.** Static parts of the room are batched, so the overview costs about 700 draw calls at high quality and about 390 at medium (down from about 1,500 and 750), and runs at about 120 fps on the development laptop. Phones start at medium and the app steps down further if frames fall, but none of that has been tried on a real phone.
- **The cat, guitar and lamp are pointer-only.** The lamp has keyboard/HUD equivalents (`N`, "Night lights"); the cat and guitar are decorative easter eggs.
- **The reference image's loft, kitchen and shower were not built.** Their props were adapted into the single room instead (wall shelf for the loft bookshelf, citrus tree and trailing vine for the kitchen plants).
- **The 3D chunk is about 273 kB gzipped** (three.js + helpers), loaded behind the welcome screen.
- **Screen-reader behaviour was checked by inspecting roles, names and focus,** not with a full VoiceOver/NVDA pass.
- Two three.js deprecation warnings (`THREE.Clock`) are logged by React Three Fiber itself in development.

## Roadmap

**Next**
- Profile on real phones; if still heavy, instance repeated pieces (leaves, bulbs, wiggling books) and bake the outline shells.
- Real content: project images, links, an "about / contact" station.
- Device testing on iOS Safari, Android Chrome and Firefox; a real screen-reader pass.
- Playwright smoke tests that drive the actual canvas.

**Later**
- Sound: soft ambience and per-object effects, off by default with a mute toggle.
- Per-project detail views (gallery / case-study pages) opened from showcase cards.
- Replace some code-built props with hand-modelled glTF assets (Draco/Meshopt compressed, lazy-loaded per station).
- A CMS or Markdown source for `room.ts` so content can be edited without touching code.
- More easter eggs: seasonal decorations, a guestbook on the corkboard.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how it is built and [`docs/DEVLOG.md`](docs/DEVLOG.md) for the decisions and bugs along the way.
