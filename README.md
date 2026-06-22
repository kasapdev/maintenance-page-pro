# Maintenance Page Generator Pro

Design a beautiful "site under maintenance" page with a live preview, then export one self-contained HTML file you can deploy anywhere.

> Point-and-click maintenance pages without touching code. Pick an icon, write your copy, add a ticking countdown and progress bar, theme the background, drop in your social links — and ship a single standalone `maintenance.html` with zero dependencies.

## Overview

Maintenance Page Generator Pro is a fast, offline-first design tool for the "we'll be right back" page every site eventually needs. A split-screen workspace pairs a live editor with a realistic browser-frame preview that re-renders as you type. When you're happy, export a complete HTML document — all CSS and JavaScript inlined, the countdown working entirely offline — ready to drop onto any host.

It runs with no build step and no network calls: open `index.html` from your file system or host it on GitHub Pages. Your configuration is saved locally in your browser, so you can pick up exactly where you left off.

## Features

- **Live preview** — a browser-frame mockup with an iframe that re-renders (debounced) on every change, so what you see is exactly what you export.
- **Icon picker** — choose from a curated set of emoji (wrench, gear, rocket, hourglass and more) or paste your own.
- **Rich content** — title, message, and footer note with sensible character limits and confident default copy.
- **Live countdown** — count down to a target date and time in DD:HH:MM:SS; automatically flips to "We are back!" at zero. Pure JS, works offline.
- **Animated progress bar** — toggle on and set completion percentage with a striped, animated bar.
- **Background styles** — Dark gradient, Light, Mesh, or Solid, each with editable color pickers (hex inputs too) and a tunable accent color.
- **Social links** — add/remove rows for X, Instagram, GitHub, LinkedIn, Discord, Email, or a generic website, rendered as a polished icon row (email becomes a `mailto:` link).
- **Custom CSS** — inject your own styles into the exported page for full control.
- **One-click export & copy** — download a standalone `maintenance.html` or copy the full HTML to your clipboard.
- **Dark + light themes**, fully responsive (with an Edit/Preview toggle on mobile), keyboard shortcuts, autosave, and a friendly empty state.

## Installation

No dependencies, no build step.

```bash
git clone https://github.com/kasapdev/maintenance-page-pro.git
cd maintenance-page-pro
# then just open index.html in your browser
```

Or simply double-click `index.html` — it runs straight from `file://`.

Hosted version (GitHub Pages): **https://kasapdev.github.io/maintenance-page-pro/**

## Usage

1. Pick an **icon**, write your **title**, **message**, and **footer**.
2. Optionally enable the **countdown** and choose a target date/time, and/or the **progress bar**.
3. Choose a **background style** and fine-tune the **accent** and background **colors**.
4. Add your **social links** (and any **custom CSS** under Advanced).
5. Watch the **live preview** update in real time.
6. Click **Export HTML** to download `maintenance.html`, or **Copy HTML** to grab it for pasting into a file.
7. Upload the exported file to your host and point your domain at it during maintenance windows.

Your configuration autosaves to this browser. Use **Load example** to see a fully-populated page, or **Reset** to start fresh.

## Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Export standalone HTML | `Ctrl`/`⌘` + `E` |
| Copy HTML to clipboard | `Ctrl`/`⌘` + `Shift` + `C` |
| Show keyboard shortcuts | `?` |
| Close dialog | `Esc` |

## Screenshots

![Editor and live preview](docs/screenshot-1.png)
![Exported maintenance page](docs/screenshot-2.png)

_Screenshots coming soon._

## Roadmap

- [ ] Save and manage multiple named presets
- [ ] Email-capture form block ("notify me when you're back")
- [ ] Import an existing exported page back into the editor
- [ ] Logo image upload (inlined as a data URI)
- [ ] Per-style background pattern library (dots, grid, noise)

## License

Released under the [MIT License](LICENSE).
