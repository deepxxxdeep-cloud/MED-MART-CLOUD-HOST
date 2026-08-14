# Med-Mart — Progress Notes

B2B medical equipment marketplace landing page (med-mart.in).
React 19 + Vite 8 + Tailwind v4 + Framer Motion + lucide-react.

## Run it

```bash
npm run dev     # http://localhost:5173
npm run build
```

## What's built (homepage only)

Single landing page, all sections done:
Header · Hero · CategoryGrid · WhyChooseUs · FeaturedProducts · HowItWorks ·
Testimonials · CTABanner · Footer

## The signature effect (most important part)

The whole site sits on **one fixed background video** of clouds seen through an
airplane window (`public/media/plane-window.mp4`), taken from the reference the
client shared.

- `SiteBackgroundVideo.jsx` — the video is **paused**; its `currentTime` is
  driven directly by page scroll progress (`scrollYProgress × duration`), so
  scrolling scrubs the footage frame by frame. It is NOT a free-running loop.
- Every section is **fully transparent** over it — no white/blur overlay
  panels. The client explicitly rejected overlays that washed the video out.
- All section text is **white with drop-shadows** for legibility on the sky.
- Cards use `bg-white/10` + `border-white/25` so the clouds show through them.

### Card entrance — "fly through the window"

`FlyThroughItem.jsx` + tall sticky sections (`h-[200vh]`–`h-[320vh]` with a
`sticky top-0 h-screen` inner wrapper).

Each card measures its real grid slot (`offsetLeft/Top`, layout-based so our
own transforms don't corrupt it), then as its slice of the section's scroll
progress plays it travels **from the grid centre out to its slot**, scaling
`0.08 → 1` and un-blurring `12px → 0`. Cards therefore emerge one-by-one from
deep inside the window and settle to the sides.

Applied in: CategoryGrid, WhyChooseUs, FeaturedProducts, Testimonials.

## Icons — no emoji, no flat icons

`src/components/icons3d/` — custom glossy 3D tiles.

- `IconTile3D.jsx` — rounded tile with layered gradient body, radial sheen,
  bottom shade, hairline highlight, drop shadow. Takes a `glyph` + `variant`
  (`orange` | `navy`).
- `glyphs.jsx` — stroke glyphs drawn around origin (~-11..11), `fill="none"`.
  Medical set: stethoscope, syringe, microscope, hospital bed, shield, flask,
  bone, cross, boxes, laptop, x-ray, monitor, scalpel, centrifuge, mask,
  ultrasound, pill bottle, package, truck, heart-pulse, badge-check, etc.

Product cards and category cards both use these. **Do not reintroduce emoji** —
the client called them cartoonish.

Note: `lucide-react` v1 dropped brand icons, so the footer socials are hand-rolled
inline SVGs in `SocialIcons.jsx`.

## Design tokens (`src/index.css`)

- Fonts: **Clash Display** (headings, via Fontshare) + **General Sans/Inter** (body)
- Colors: orange `#F26522`, navy `#1B2A6B`, navy-deep `#0F1A45`, gold `#E8B23D`
- Utilities: `.shadow-soft` / `.shadow-elevated` / `.shadow-glow-orange` /
  `.shadow-glow-navy` (layered multi-shadow), `.glass`, `.glass-dark`,
  `.border-gradient`, `.noise-overlay`, `.perspective`, `.tilt-card`,
  `.ease-premium`, plus `float` / `mesh-drift` / `pulse-glow` keyframes.
- `TiltCard3D.jsx` — real `rotateX/rotateY` hover tilt with mouse-following glare.

## Data

All dummy — `src/data/siteData.js` (categories, featuredProducts, testimonials,
categoryMenu, trustStats). Client will wire a real DB later.

## TODO / next session

- [ ] **Compress `plane-window.mp4`** — currently ~25 MB uncompressed. No ffmpeg
      on this machine. Must be a few MB before production or it will stall on
      real connections. Also add a poster frame + a mobile fallback.
- [ ] Video is from a Paris travel template — the **Eiffel Tower appears** in the
      last few seconds (visible around the Testimonials section). Either trim the
      clip to the clouds-only portion (~first 6–7s) or accept it. Ask the client.
- [ ] Build the other pages (product listing, product detail, seller dashboard).
- [ ] Wire search + category dropdown to actually filter.
- [ ] Mobile pass on the tall sticky fly-through sections (works, but the long
      scroll distance is worth re-checking on a real device).
