# FaathirTaKa — Portfolio

Warm "coffee cherry", music-stylized portfolio for **Faathir Kuspratama Pasha**
(known as **FaathirTaKa**, **TaKa**, **Pasha**, or **TK**) — website development,
Flutter (Android) apps, visual novel game development, UI/UX, and tooling.

Built with plain **HTML + CSS + JavaScript**. No build step, no dependencies.

## Files

```
index.html      # the whole page
style.css       # design system + all styling
main.js         # interactions (theme, reveals, cursor, form)
favicon.svg     # vinyl-disc favicon
.nojekyll       # tells GitHub Pages not to run Jekyll
```

## Run locally

Just open `index.html` in a browser. Or serve it:

```powershell
npx serve .
```

## Before you publish — 3 edits

1. **Email address** — already set in `main.js`:
   ```js
   const CONTACT_EMAIL = "faathirkuspratamapasha36@gmail.com";
   ```
   The contact form uses this to open the visitor's mail app (no backend needed).

2. **Projects** — in `index.html`, edit the `#work` section (the "Setlist" list).
   Each row is one `<li class="setlist__item">` block. The **Visual Novel Game** row
   currently points at your GitHub repositories — swap in the real store/itch.io
   link when you have one.

3. **Profile photo** — the photo is pulled live from your GitHub avatar
   (`https://avatars.githubusercontent.com/FTaKa36`). To use a different picture,
   drop a file in this folder (e.g. `photo.jpg`) and change the `src` in the
   `.photo img` inside the `#about` section.

## Editing the look

All colors and spacing live as CSS variables at the top of `style.css`:

- `--accent`, `--accent-2`, `--accent-3`, `--accent-soft`, `--accent-4` — the warm cherry red palette
- `--bg`, `--surface`, `--text`, `--muted` — the coffee-brown base
- `--danger` — form error color
- Dark theme is the default `:root`; light theme is under `html[data-theme="light"]`
- Fonts: **Fraunces** (display), **Outfit** (body), **JetBrains Mono** (labels)

The theme toggle saves the visitor's choice in `localStorage` and falls back to their
system preference on first visit.

## Motion

The page is deliberately animated so it never looks frozen:

- The vinyl record spins continuously, with a counter-rotating light glint
- The turntable gently bobs and the tonearm sways
- Music notes drift up the background
- Section headings shimmer with a moving gradient
- The scroll meter, marquee, equalizer bars, and cursor glow all animate

> If the record looks still on your machine, check **Windows Settings → Accessibility →
> Visual effects → Animation effects**. Turning animations off sets the browser's
> `prefers-reduced-motion` flag. The site respects that by calming the decorative
> motion, but keeps the record spinning slowly (9s) so it never looks dead.

## Deploy to GitHub Pages

The site is already static and `.nojekyll` is included.

**Option A — user site (`https://FTaKa36.github.io`)**
1. Create a repo named `FTaKa36.github.io`.
2. Push these files to the `main` branch.
3. Visit `https://FTaKa36.github.io`.

```powershell
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/FTaKa36/FTaKa36.github.io.git
git push -u origin main
```

**Option B — project site (`https://FTaKa36.github.io/<repo>`)**
1. Push this folder to any repo (e.g. `portfolio`).
2. On GitHub: **Settings → Pages**.
3. Source: **Deploy from a branch**, Branch: **main**, Folder: **/ (root)**.
4. Save, then visit `https://FTaKa36.github.io/portfolio/`.

> Note: `git` is not currently on this machine's PATH. Install Git for Windows, or upload
> the files through the GitHub web UI if you prefer.

## Links wired in

GitHub, Instagram, YouTube, Steam, Konect, Spotify, TikTok, LinkedIn — all in the
"Find me on every channel" section.

## Accessibility

- Keyboard focus styles, skip link, and `aria` labels on interactive controls
- Respects `prefers-reduced-motion` (decorative motion is calmed, content stays visible)
- Dark/light contrast kept readable in both themes
