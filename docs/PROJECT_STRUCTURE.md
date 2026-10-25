# Project structure

The project keeps Flask routes and page markup separate from browser assets. The `static` tree is grouped by asset type, with page entry points in their own folders.

```text
app.py                         Flask routes
templates/
  index.html                   Planet comparison page
  orbits.html                  Solar-system animation page
  moons.html                   Moon information page
  milky_way.html               Zoomable Milky Way illustration
static/
  data/
    moons.json                 Moon descriptions, NASA links, and orbit periods
  css/
    style.css                  Shared visual theme
    orbits.css                 Solar-system animation styles
    moons.css                  Moon page styles
    pages/                      Page-specific stylesheet entry points
    pages/                     Per-page stylesheet entry points
  js/
    script.js                  Shared page behavior and planet facts
    orbits.js                  Planet and moon animation
    moons.js                   Compatibility loader for the moon page
    pages/                     Per-page JavaScript entry points
      milky_way.js               Galaxy canvas, zoom and pan controls
docs/
  PROJECT_STRUCTURE.md         This guide
```

## Where to make changes

- Edit moon descriptions, parent planets, NASA source links, or displayed orbital periods in `static/data/moons.json`. Both the moon page and orbit animation read this file.
- Adjust orbit calculations, body appearance, speed controls, and belt rendering in `static/js/orbits.js`.
- Change the moon information page layout in `templates/moons.html`; its page behavior starts in `static/js/pages/moons.js`.
- Change the orbit page layout in `templates/orbits.html`; its animation entry point is `static/js/pages/orbits.js`.
- Change the Milky Way page layout in `templates/milky_way.html`, its colors and layout in `static/css/pages/milky_way.css`, or zoom behavior in `static/js/pages/milky_way.js`.
- Change visual design in the appropriate file in `static/css/`.

The small files under `static/css/pages/` and `static/js/pages/` are page entry points. This keeps the templates explicit about which page assets they load while shared and feature-specific code remains in its own files.
