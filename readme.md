# Atlas Craft

Solo-studio portfolio site. Vite + React 18 + TypeScript, plain CSS (custom properties),
no UI kit, no CSS-in-JS.

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build -> dist/
npm run preview   # serve the production build locally
```

## Folder map

```
index.html                  Vite entry; blocking theme-init script + Google Fonts
src/
  main.tsx                  React root
  App.tsx                   page composition
  config.ts                 CONTACT_URL, RESUME_URL — edit these
  data/portfolio.ts         portfolio items per tab — edit this
  hooks/
    useTheme.ts              dark/light, persisted in localStorage
    useReveal.ts              scroll-reveal IntersectionObserver
    useScrolledPastHero.ts    drives the header's "over-light" state
  components/
    Header.tsx                locked floating nav (WORK / ABOUT / CONTACT)
    Hero/
      Hero.tsx                 locked hero copy + layout
      HeroCanvas.tsx            the cursor-tracking engine (canvas + rAF)
      engine.ts                 pure helpers: wrap(), pickRingFile(), trackStep()
    Services/, Portfolio/, About.tsx, ContactBand.tsx, Footer.tsx
    CustomCursor.tsx, ThemeToggle.tsx, Loader.tsx, Logo.tsx
  styles/tokens.css, base.css
public/
  frames/                    extracted hero WebP frames + map.json (see below)
  character.png              portfolio thumbnail, extracted from the same footage
```

## Editing

- **Contact link / resume link**: `src/config.ts`. `CONTACT_URL` empty ⇒ every "Start a
  project" / portfolio CTA scrolls to `#contact` instead of opening a link.
- **Portfolio items**: `src/data/portfolio.ts`. An item without `img` renders the striped
  "Placeholder" tile automatically.
- **Hero tracking feel**: constants at the top of `src/components/Hero/engine.ts`
  (`GAIN_X`, `TAU_MS`, `DEAD_IN`, `DEAD_OUT`).

## The hero engine, and where it differs from a from-scratch spec

This was built against the actual raw character video
(`public/frames/` was generated from it, not hand-authored), so the implementation
here is pragmatic rather than a literal port of an idealized frame scheme:

- **No `legacy/index.html`.** There was no pre-existing finished vanilla build to port —
  the repo's prior state was an unrelated Three.js course scaffold plus an abandoned,
  differently-scoped draft (different copy, a single JPEG sprite sheet). Both were
  removed; this is a from-scratch build against the brief's locked copy/design tokens.
- **Frame extraction** (`scripts/extract_frames.py` — `pip install opencv-python
  pillow`, then `ATLAS_SRC_VIDEO=/path/to/character.mp4 python3 scripts/extract_frames.py`
  — run once, output committed):
  the 240-frame/24fps source has one continuous, usable head-turn sweep — frame 28
  (looking up) through frame 210 (looking left), ~270° of real motion at a roughly
  constant angular speed — plus a sharp direct-eye-contact frame (1) used for
  `center.webp` and `public/character.png`. The remaining ~90° arc (left back to up) has
  no footage. **Calibration note:** small thumbnails are not reliable for judging head
  yaw from a single video frame — an early pass misjudged frame 102 as "looking left"
  when, checked at full resolution against a fixed centerline, it's still clearly turned
  right. The anchors above (28=up, 97=right, 150=down, 210=left) were confirmed that way,
  at full resolution, before extraction.
- **Angle → frame mapping** (`engine.ts: pickRingFile`): the 183 real frames are played
  back linearly across their real angular span. For the ~90° with no footage, the engine
  nearest-snaps to whichever real endpoint (up or left) is angularly closer, rather than
  reusing a mid-sweep frame out of context or fabricating one.
- **No cross-fade, anywhere, including the bridge seam.** A cross-fade was tried for the
  up↔left seam (the one unavoidable hard cut, at the edge of the no-footage bridge arc)
  to smooth it out. In practice, alpha-blending between two quite different head
  orientations (up vs. left) reads as a double-exposure ghost/smear, not as motion — it
  made that seam look *worse*, not better. Reverted: every transition, including that
  seam, is one crisp instant frame swap, per the tutorial source's own rule ("no alpha
  blending — it causes double-face ghosting"). The seam is still a hard cut (there's no
  footage to animate through), but a clean snap reads better than a smeared blend. If
  this needs revisiting, don't reach for alpha blending again without comparing it
  side-by-side against a plain snap first.
- **No wedge/ramp footage layers.** The brief describes a 3-layer frame scheme (ring +
  wedge + ramp, with a specific cut index). That scheme describes footage this video
  doesn't contain (no separate "rising to look up" take, no wedge take with a real cut).
  Re-implementing it would mean fabricating motion; the simpler single-ring-plus-bridge
  model above is what the real source supports.
- **Cover/crop math**: frames are plain 1280×720 (not pre-cropped/zoomed), so the hero
  uses a standard centered "cover" fit on both axes, biased vertically toward the face in
  portrait, instead of the brief's magic crop constants (which were tuned for a
  differently-cropped source).

## StrictMode

`HeroCanvas`, `CustomCursor`, `useReveal` and `useScrolledPastHero` each own exactly one
`useEffect` that starts a listener/observer/rAF loop and returns a matching cleanup, so
React 18 StrictMode's mount→unmount→mount dev check doesn't leak or double anything.
