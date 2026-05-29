# Image/slide carousel with dots

This task spans **3 files**. Shows one slide at a time with Prev/Next that wrap around, plus dot
indicators that reflect and jump to the active slide.

- `components/types.ts` — exports `type Slide = { id: string; caption: string }`.
- `components/Dots.tsx` — accepts `{ count: number; active: number; onJump: (index: number) => void }`.
  Renders `<div data-testid="dots">` with `count` buttons, each `<button data-testid="dot-<index>">`.
  The active dot has `aria-current="true"`; the others have no `aria-current` attribute. Clicking a dot
  calls `onJump(index)`.
- `components/Carousel.tsx` (entry, default export) — accepts `{ slides: Slide[] }`. Tracks the active
  index (starts at `0`). Renders:
  - `<button data-testid="prev">Prev</button>` and `<button data-testid="next">Next</button>`.
  - Only the **active** slide's caption inside `<div data-testid="slide">{caption}</div>` (exactly one
    slide content shown at a time).
  - a `Dots` reflecting `slides.length` / active index, where clicking a dot jumps to that slide.

  Next advances the index, wrapping from the last slide back to `0`. Prev goes back, wrapping from `0`
  to the last slide. (Assume `slides` is non-empty.)
