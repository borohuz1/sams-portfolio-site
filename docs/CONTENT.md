# Content guide

Everything a visitor reads is in `sources/data/`. Edit a file, save, and the
site updates. You never need to touch the game code for this.

Run `npm run check` after editing, to catch a file name that does not exist.

---

## `site.js` — the master file

### Identity

```js
name: 'Mohammad Sams Shahriar',
shortName: 'Sams',
role: 'Multidisciplinary Technical & Digital Professional',
location: 'Khilgaon, Dhaka 1219, Bangladesh',
siteTitle: "Sams' Home",
```

`siteTitle` is the title on the card that appears when you enter the world.

### The intro text

```js
intro: 'I connect technical work, business operations and digital creativity...',
guide: 'This is my portfolio. Drive around the island to visit each of my zones...',
```

`intro` is the short paragraph under the title on the home panel. `guide` is the
line that tells a visitor what to do.

### `zones.career` — the six stone slabs

This is the part that matters most. There are exactly six slabs in the world,
and they are ordered from oldest to newest along the road you drive.

```js
{
    id: 'factory',
    title: 'FACTORY',              // big letters painted on the slab
    subtitle: 'GARMENT MFG',      // small letters under it
    texture: 'careerFactory',     // the file in static/career/ (must match!)
    period: 'Production floor',
    description: 'Garment manufacturing, production planning and B2B work...',
    tools: [ 'Production planning', 'B2B', 'Quality checks' ]
}
```

| Field | Rules |
| --- | --- |
| `id` | Any name you like. Only used by scripts. |
| `title` | The big painted word. Keep it short, one word. |
| `subtitle` | The small painted line. Use `\|` to split it over two lines. |
| `texture` | Must be `careerFactory`, `careerOffice`, `careerWorkshop`, `careerStudio`, `careerPlayground` or `careerAgency`. The file in `static/career/` has the same name. |
| `period` | Shown when the slab opens, for example `2.5 years`. |
| `description` | The paragraph you read when the slab lifts. |
| `tools` | Short labels, shown as a list. |

**Order matters.** The array is read from the first entry to the last, and the
first entry is the slab you meet first when you drive in. If you swap two
entries, swap the two `texture` names as well.

**The `|` character** in `subtitle` means "new line". `AI, CGI & EDIT|GRAPHIC DESIGN`
paints two lines.

### `career` — the year counter

```js
career: {
    startYear: 2022,
    totalYears: 4
}
```

The big digits next to the slabs count the years as you drive. `startYear` is
where it starts, `totalYears` is how many years it sweeps through.

### `tools` — the tool list

```js
tools: [
    { name: 'AutoCAD', status: 'daily' },
    { name: 'Blender', status: 'learning' }
]
```

`status` is either `daily` or `learning`. Be honest here. This list is shown in
the console log when the world starts, so it is the first thing a developer
who opens the console will see.

### `contact` — how to reach you

```js
contact: {
    email: 'samsspy01@gmail.com',
    phones: [
        { label: 'Phone', number: '01617541939' },
        { label: 'WhatsApp', number: '01853397899' }
    ],
    address: 'Khilgaon, Dhaka 1219, Bangladesh',
    linkedin: 'https://linkedin.com/in/sams-shahriar',
    github: 'https://github.com/sams-shahriar',
    website: 'https://esolver.site'
}
```

`phones` is a list, so you can have as many as you want. The `label` is what a
visitor reads next to the number.

### `siteUrl`

The address the site will live at once it is published. It is used for the
share image and the social meta tags.

### `behindTheScene` — the panel that explains the build

```js
{
    title: 'Behind the scene',
    intro: 'Thank you for visiting my portfolio!...',
    sections: [
        { title: 'The stack', html: '... <strong>HTML</strong> works here ...' }
    ],
    signOff: 'Sams'
}
```

The `html` field is inserted as it is, so links and `<strong>` work. Keep the
credit to Bruno Simon in the "Source code" section. It is both the right thing
to do and the condition of the MIT license.

---

## `projects.js` — the screens in the workshop

```js
{
    title: 'Sentinel Siege',
    titleSmall: [ 'Sentinel', 'Siege' ],   // the small 3D sign, one line per entry
    url: 'https://github.com/sams-shahriar',
    description: 'One line that says what it is and what it does.',
    attributes: {
        role: [ 'Solo developer' ],
        with: [ 'Local-first', 'Windows' ]
    },
    distinctions: [],
    images: [ 'sentinel-siege-1.png', 'sentinel-siege-2.png' ]
}
```

- `images` are files in `static/projects/images/`. 960x540 PNG.
- `attributes` has three possible rows: `role`, `at` and `with`. Leave a row out
  if you do not need it.
- `url` is opened when the visitor presses the button on the screen.

**Being honest matters more than looking big.** A project marked
`In development` with a real screenshot is better than a finished-sounding
project with nothing behind it.

---

## `lab.js` — the shelf in the lab

```js
{
    title: 'Drivable Portfolio',
    url: 'https://github.com/sams-shahriar/drivable-portfolio',
    image: 'drivable-portfolio.png',        // 960x540
    imageMini: 'drivable-portfolio-mini.png',// 480x270
    status: 'This site',
    description: 'Three.js, TSL shaders and Rapier physics in one island you drive around.'
}
```

The lab is for the things you are trying out. `status` is shown as a badge, so
write it the way you mean it: `In progress`, `Sketching`, `Working`,
`In development`, `This site`.

---

## `social.js` — the links around the statue

```js
{ name: 'Email', url: 'mailto:samsspy01@gmail.com', align: 'right' }
{ name: 'Contact card', modal: 'contact', align: 'right' }
```

- `url` opens in a new tab.
- `modal` opens a panel instead. The only one that exists is `contact`.
- `align` is `left` or `right`, and decides which side of the statue the label
  sits on. Alternate them so they do not overlap.

---

## `achievements.js` — the list

Each entry is:

```js
[ 'key', 'Title', 'Description', 'amount', true ]
```

- `key` is the progress key the game uses.
- `amount` is how many are needed.
- The optional `true` at the end marks a unique achievement.

The `projects` and `lab` entries count themselves from the data files, so you
do not have to update them when you add a project.

---

## Generated images

`npm run content` redraws every placeholder image from the data files:

- the six zone label plates in `static/career/`
- the project screens in `static/projects/images/`
- the lab shelf images in `static/lab/images/`

If you have real screenshots, keep them. The script only overwrites the files
it generated, so copy your own screenshots in afterwards, or replace them
afterwards and do not re-run the script for those names.
