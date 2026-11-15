/**
 * Checks that every asset the game asks for actually exists on disk.
 *
 * This project ships the UNCOMPRESSED assets, so the default run checks the
 * uncompressed set. Pass "--compressed" to check the compressed set instead
 * (it will report the compressed files as missing unless you have regenerated
 * them with scripts/compress.js).
 *
 * It also checks the files that are named in data files and in index.html,
 * because a missing one only shows up as a silent 404 at runtime.
 *
 * Run with: node scripts/check-assets.js
 */

import fs from 'node:fs'
import path from 'node:path'
import site from '../sources/data/site.js'
import projects from '../sources/data/projects.js'
import lab from '../sources/data/lab.js'
import social from '../sources/data/social.js'

const ROOT = path.resolve('.')
const STATIC = path.join(ROOT, 'static')
const SOURCES = path.join(ROOT, 'sources')

const compressed = process.argv.includes('--compressed')

let problems = 0
let checked = 0

function check(relativePath, why)
{
    checked++

    const full = path.join(STATIC, relativePath)

    if(fs.existsSync(full))
        return true

    problems++
    console.log(`  MISSING  ${relativePath}  (${why})`)

    return false
}

/* ------------------------------------------------------------------ *
 * 1. The resource list declared in Game.js
 * ------------------------------------------------------------------ */

console.log('Checking the resource list from Game.js...')

const gameJs = fs.readFileSync(path.join(SOURCES, 'Game', 'Game.js'), 'utf8')

// Every template literal that builds a resource path.
const pathTemplates = [
    ...gameJs.matchAll(/`([^`]*\$\{compressedModelSuffix\}[^`]*)`/g),
    ...gameJs.matchAll(/`([^`]*\$\{compressedTextureExtension\}[^`]*)`/g)
].map((match) => match[1])

for(const template of pathTemplates)
{
    const resolved = template
        .replace('${compressedModelSuffix}', compressed ? '-compressed' : '')
        .replace('${compressedTextureExtension}', compressed ? 'ktx' : 'png')
        .replace('${cb}', '')
        .replace(/^\//, '')

    check(resolved, 'Game.js resource list')
}

/* ------------------------------------------------------------------ *
 * 2. The intro control labels (loaded by Intro.js, not by Game.js)
 * ------------------------------------------------------------------ */

console.log('Checking the intro control labels...')

for(const name of [ 'mouseKeyboard', 'touch', 'gamepadXbox', 'gamepadPlaystation' ])
    check(`intro/${name}Label.${compressed ? 'ktx' : 'png'}`, 'Intro.js control label')

/* ------------------------------------------------------------------ *
 * 3. The zone label plates
 * ------------------------------------------------------------------ */

console.log('Checking the zone label plates...')

for(const zone of site.zones.career)
    check(`career/${zone.texture}.png`, `zone "${zone.id}"`)

/* ------------------------------------------------------------------ *
 * 4. Project and lab images
 * ------------------------------------------------------------------ */

console.log('Checking the project images...')

for(const project of projects)
{
    for(const image of project.images)
        check(`projects/images/${image}`, `project "${project.title}"`)

    if(!project.url)
    {
        problems++
        console.log(`  NO URL   project "${project.title}" has no url`)
    }
}

console.log('Checking the lab images...')

for(const item of lab)
{
    check(`lab/images/${item.image}`, `lab "${item.title}"`)
    check(`lab/images/${item.imageMini}`, `lab "${item.title}"`)

    if(!item.url)
    {
        problems++
        console.log(`  NO URL   lab "${item.title}" has no url`)
    }
}

/* ------------------------------------------------------------------ *
 * 5. Files referenced from index.html
 * ------------------------------------------------------------------ */

console.log('Checking the files referenced from index.html...')

const html = fs.readFileSync(path.join(SOURCES, 'index.html'), 'utf8')

const htmlRefs = [
    ...html.matchAll(/<link[^>]+href="([^"#][^"]*)"/g),
    ...html.matchAll(/<img[^>]+src="([^"]+)"/g),
    ...html.matchAll(/<script[^>]+src="([^"]+)"/g)
].map((match) => match[1])

for(const ref of htmlRefs)
{
    // Skip absolute urls and anything that is not a static asset.
    if(/^(https?:)?\/\//.test(ref) || ref.startsWith('data:'))
        continue

    // Strip the leading "./" and any query string.
    const clean = ref.replace(/^\.\//, '').split('?')[0]

    // Only check things that live in the static folder.
    if(!/^(ui|favicons|social|career|areas|intro|palette|respawns|behindTheScene)\//.test(clean))
        continue

    check(clean, 'index.html')
}

/* ------------------------------------------------------------------ *
 * 6. The social links
 * ------------------------------------------------------------------ */

console.log('Checking the social links...')

for(const item of social)
{
    if(item.modal)
        continue

    if(!item.url)
    {
        problems++
        console.log(`  NO URL   social item "${item.name}" has no url`)
    }
}

/* ------------------------------------------------------------------ *
 * 7. The contact details
 * ------------------------------------------------------------------ */

console.log('Checking the contact details...')

const contact = site.contact

if(!contact.email) { problems++; console.log('  MISSING  contact.email') }
if(!contact.linkedin) { problems++; console.log('  MISSING  contact.linkedin') }
if(!contact.website) { problems++; console.log('  MISSING  contact.website') }
if(!contact.phones || contact.phones.length === 0) { problems++; console.log('  MISSING  contact.phones') }

/* ------------------------------------------------------------------ *
 * Result
 * ------------------------------------------------------------------ */

console.log('')

if(problems === 0)
{
    console.log(`OK - ${checked} files checked, nothing missing.`)
    process.exit(0)
}

console.log(`FAILED - ${problems} problem(s) out of ${checked} checks.`)
process.exit(1)
