# Music Theme Portfolio

A personal **portfolio website** with a warm "coffee cherry" look and a music-inspired
theme — turntable, vinyl records, and setlist styling carry the whole design.

## What this site is for

- **Show what I build** — a project list with a short description and current status
  for each one (released, live, or still in development).
- **Introduce my skills** — the languages, frameworks, and tools I work with.
- **Give visitors a way to get in touch** — a contact form for project enquiries,
  plus links to my social and community profiles.

In short: one page that says who I am, what I make, and how to reach me.

## Tech

Plain **HTML, CSS, and JavaScript** — no build step, no frameworks, no dependencies.

```
web/
  index/index.html        # the whole page
  stylesheet/style.css    # design system + all styling
  js/main.js              # interactions (theme, nav, reveals, contact form)
favicon.svg               # vinyl-disc favicon
```

## Run locally

Open `web/index/index.html` in a browser, or serve the folder:

```powershell
npx serve .
```

## Features

- **Dark and light theme** with a toggle that remembers the visitor's choice
- **Responsive layout** for desktop, tablet, and mobile
- **Contact form** that sends a message directly, with inline success/error feedback
- **Subtle motion** — spinning vinyl, drifting notes, section reveals
- **Accessible** — keyboard focus styles, skip link, `aria` labels, and respect for
  `prefers-reduced-motion`

## Customizing

This site is personal, so most content is specific to its owner:

- **Project list** lives in the `#work` section of the HTML — one block per project,
  each with a title, status label, description, tech tags, and a link.
- **Colors, spacing, and fonts** are CSS variables near the top of the stylesheet,
  so the palette can be re-themed in one place.
- **Contact destination** is configured in the JavaScript as a single constant.

## Deploying

The site is fully static, so it can be hosted anywhere that serves files — GitHub
Pages, Netlify, Cloudflare Pages, or any web host. Upload the contents of the `web/`
folder to the hosting root and the site works as-is.
