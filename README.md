# Drivable Portfolio

An interactive 3D portfolio you drive a car around. Instead of scrolling a page,
you visit an island: your career zones are stone slabs you drive past, your
projects are screens in the workshop, your experiments sit on a shelf in the
lab, and your contact details are around the statue.

Built on top of [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025)
(MIT licensed). The world, the car and the engine are Bruno Simon's work; the
content is mine.

---

## Quick start

```bash
npm install
copy .env.example .env      # Windows
npm run dev
```

Then open the URL that Vite prints. **It does not open a browser on its own**,
because this world renders continuously with WebGPU and will keep a CPU and a
GPU busy. Close the tab when you are done looking.

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build
```

---

## Editing the content

Almost everything a visitor reads lives in `sources/data/`.

| File | What it controls |
| --- | --- |
| `sources/data/site.js` | Name, role, bio, the six zones, the tool list, contact details, the "behind the scene" panel |
| `sources/data/projects.js` | The projects shown on the screens in the workshop |
| `sources/data/lab.js` | The experiments shown on the shelf in the lab |
| `sources/data/social.js` | The contact links standing around the statue |
| `sources/data/achievements.js` | The achievement list |

`docs/CONTENT.md` explains every field.

### Images

| Folder | Size | What it is |
| --- | --- | --- |
| `static/career/` | 960x540 area, per-zone plate size | The painted zone label on each stone slab |
| `static/projects/images/` | 960x540 | The screens in the workshop |
| `static/lab/images/` | 960x540 and 480x270 | The shelf in the lab |

If you have real screenshots, drop them in with the same file name and size and
they will be used as they are.

If you do not, `npm run content` draws placeholder cards for everything that is
missing, using the titles and descriptions from the data files. It needs no
design tool, only `sharp`.

---

## Checking that nothing is missing

```bash
npm run check
```

This walks every asset the game asks for, every image named in a data file and
every file referenced from `index.html`, and reports anything that is not on
disk. Run it after editing content. It is cheap and does not start a browser.

---

## How the world is put together

The zone slabs are painted stone in `static/areas/areas.glb`. That file is
generated from a pristine copy by:

```bash
npm run patch:areas
```

The script always starts from `static/areas/areas.glb.bak` (the untouched
original), so it can be re-run as many times as you like. It does two things:

1. Points the six slabs at this portfolio's own zone textures.
2. Removes the props belonging to the original author, so the island does not
   ship somebody else's name, social accounts or characters.

If `areas.glb.bak` is ever lost, restore a fresh copy of `areas.glb` from the
upstream repository into that path and re-run the script.

---

## Compressed builds

This project ships the **uncompressed** assets. `VITE_COMPRESSED` must stay
empty in `.env`.

Compressed builds need the `-compressed.glb` models and the `.ktx` textures.
Those are not in the repository, because generating them needs `toktx` and
`gltf-transform` on your machine:

```bash
npm run compress
```

`gltf-transform` is already a dependency, so the models can be rebuilt with
`npx gltf-transform`. The textures need the KTX-Software `toktx` binary, which
is not installed by `npm install`. If you do generate them, also update the four
`<link rel="preload">` paths in `sources/index.html`.

---

## Stack

- [Three.js](https://threejs.org) (WebGPU + TSL) for the world
- [Rapier](https://rapier.rs) for the physics
- [Howler.js](https://howlerjs.com) for the audio
- [GSAP](https://gsap.com) for the animation
- [Vite](https://vite.dev) for the build
- [sharp](https://sharp.pixelplumbing.com) for generating the content images

---

## Credits

- **Bruno Simon** for [folio-2025](https://github.com/brunosimon/folio-2025), the
  original drivable portfolio this is built on.
- **mr.doob** and **Sunag** for Three.js and TSL.
- **Kounine** for the music, published under
  [CC0](https://choosealicense.com/licenses/cc0-1.0/).

Full credits in [NOTICE.md](NOTICE.md).
