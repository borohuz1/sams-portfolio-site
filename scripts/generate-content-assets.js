/**
 * Generates every content image the portfolio needs.
 *
 *   static/career/*.png              the six zone labels painted on the stone slabs
 *   static/projects/images/*.png     the screens in the workshop area
 *   static/lab/images/*.png          the shelf in the lab area (plus mini versions)
 *
 * Everything is drawn with sharp from SVG, so no design tool and no image
 * editor are needed. Replace any generated file with a real screenshot of the
 * same name and size and the site will pick it up.
 *
 * Run with: node scripts/generate-content-assets.js
 */

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import site from '../sources/data/site.js'
import projects from '../sources/data/projects.js'
import lab from '../sources/data/lab.js'

const STATIC = path.resolve('static')

/* ------------------------------------------------------------------ *
 * Palette (taken from the site stylesheet)
 * ------------------------------------------------------------------ */
const COLORS = {
    dark: '#251f2b',
    darker: '#191420',
    pink: '#ffceca',
    purple: '#d66fff',
    green: '#00ff00',
    red: '#ff0000',
    white: '#ffffff'
}

/* ------------------------------------------------------------------ *
 * Text measuring
 *
 * sharp has no text metrics, so a line is rendered on its own and the
 * transparent margin is trimmed away. What is left is the real ink box.
 * ------------------------------------------------------------------ */

const measureCache = new Map()

async function measureText(text, fontFamily, fontSize, fontWeight = 'normal')
{
    const key = `${text}|${fontFamily}|${fontSize}|${fontWeight}`
    if (measureCache.has(key))
        return measureCache.get(key)

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="200">
        <text x="10" y="140" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="#ffffff">${escapeXml(text)}</text>
    </svg>`

    // NOTE: metadata() reports the input size, not the trimmed size, so the
    // buffer has to be written out to read the real ink box.
    const { info } = await sharp(Buffer.from(svg))
        .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer({ resolveWithObject: true })

    const result = { width: info.width, height: info.height }
    measureCache.set(key, result)
    return result
}

/**
 * Picks the biggest font size that keeps the cap height close to `capHeight`
 * while still fitting inside `maxWidth`.
 */
async function fitText(text, fontFamily, capHeight, maxWidth, fontWeight = 'normal')
{
    let fontSize = Math.round(capHeight * 1.36)

    let metrics = await measureText(text, fontFamily, fontSize, fontWeight)

    // Too wide: scale down until it fits.
    if (metrics.width > maxWidth)
    {
        const ratio = maxWidth / metrics.width
        fontSize = Math.max(8, Math.round(fontSize * ratio))
        metrics = await measureText(text, fontFamily, fontSize, fontWeight)
    }

    return { fontSize, width: metrics.width, capHeight: metrics.height }
}

function escapeXml(text)
{
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/* ------------------------------------------------------------------ *
 * Zone labels (the career stone slabs)
 * ------------------------------------------------------------------ */

/**
 * The label plates keep the exact pixel size of the plates they replace so
 * the UV layout and the 3D text proportions do not change.
 */
const CAREER_PLATES = {
    careerFactory: { width: 316, height: 60, lines: 1 },
    careerOffice: { width: 240, height: 60, lines: 1 },
    careerWorkshop: { width: 168, height: 60, lines: 1 },
    careerStudio: { width: 268, height: 92, lines: 2 },
    careerPlayground: { width: 340, height: 60, lines: 1 },
    careerAgency: { width: 332, height: 92, lines: 2 }
}

const TITLE_FONT = 'Impact, Haettenschweiler, Arial Black, sans-serif'
const SUBTITLE_FONT = 'Arial Narrow, Liberation Sans Narrow, Arial, sans-serif'

async function generateCareerLabel(zone)
{
    const plate = CAREER_PLATES[zone.texture]
    if (!plate)
        throw new Error(`No plate defined for zone texture "${zone.texture}"`)

    const bandHeight = plate.lines === 1 ? 27 : 26
    const gap = 5
    const titleCap = 23
    const subtitleCap = 21
    const padding = 4

    // Title
    const title = await fitText(zone.title, TITLE_FONT, titleCap, plate.width - padding * 2)
    const titleBaseline = 2 + title.capHeight

    // Subtitles
    const subtitles = zone.subtitle.split('|').map((line) => line.trim()).filter(Boolean)
    while (subtitles.length < plate.lines)
        subtitles.push('')

    const subtitleMetrics = []
    for(const line of subtitles)
    {
        if(!line)
        {
            subtitleMetrics.push(null)
            continue
        }
        const fitted = await fitText(line, SUBTITLE_FONT, subtitleCap, plate.width - padding * 2)
        subtitleMetrics.push(fitted)
    }

    const parts = []

    // Background is black, which the shader reads as "nothing here".
    parts.push(`<rect x="0" y="0" width="${plate.width}" height="${plate.height}" fill="#000000"/>`)

    // Title band
    parts.push(`<rect x="0" y="0" width="${Math.min(plate.width, title.width + padding)}" height="${bandHeight}" fill="${COLORS.green}"/>`)
    parts.push(`<text x="1" y="${titleBaseline}" font-family="${TITLE_FONT}" font-size="${title.fontSize}" font-weight="bold" fill="${COLORS.red}">${escapeXml(zone.title)}</text>`)

    // Subtitle bands
    let y = bandHeight + gap
    for(const metrics of subtitleMetrics)
    {
        if(metrics)
        {
            parts.push(`<rect x="0" y="${y}" width="${Math.min(plate.width, metrics.width + padding)}" height="27" fill="${COLORS.green}"/>`)
            parts.push(`<text x="1" y="${y + 2 + metrics.capHeight}" font-family="${SUBTITLE_FONT}" font-size="${metrics.fontSize}" font-weight="normal" fill="${COLORS.red}">${escapeXml(subtitles[subtitleMetrics.indexOf(metrics)])}</text>`)
        }
        y += 27 + gap
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${plate.width}" height="${plate.height}">${parts.join('')}</svg>`

    const out = path.join(STATIC, 'career', `${zone.texture}.png`)
    await sharp(Buffer.from(svg)).flip().png().toFile(out)
    console.log(`  career/${zone.texture}.png (${plate.width}x${plate.height})`)
}

/* ------------------------------------------------------------------ *
 * Project and lab images
 * ------------------------------------------------------------------ */

const CARD_FONT = 'Impact, Haettenschweiler, Arial Black, sans-serif'
const BODY_FONT = 'Segoe UI, Arial, sans-serif'

function cardSvg({ width, height, title, subtitle, badge, hue })
{
    const titleSize = Math.round(width * 0.075)
    const subtitleSize = Math.round(width * 0.028)
    const badgeSize = Math.round(width * 0.022)

    const padding = Math.round(width * 0.075)
    const grid = Math.round(width / 32)

    const lines = []
    lines.push(`<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stop-color="hsl(${hue}, 26%, 17%)"/>
            <stop offset="55%" stop-color="hsl(${hue}, 22%, 12%)"/>
            <stop offset="100%" stop-color="hsl(${hue}, 26%, 8%)"/>
        </linearGradient>
        <pattern id="grid" width="${grid}" height="${grid}" patternUnits="userSpaceOnUse">
            <path d="M ${grid} 0 L 0 0 0 ${grid}" fill="none" stroke="hsl(${hue}, 40%, 40%)" stroke-opacity="0.28" stroke-width="1"/>
        </pattern>
    </defs>`)

    lines.push(`<rect width="${width}" height="${height}" fill="url(#bg)"/>`)
    lines.push(`<rect width="${width}" height="${height}" fill="url(#grid)"/>`)

    // Glow
    lines.push(`<ellipse cx="${width * 0.72}" cy="${height * 0.28}" rx="${width * 0.3}" ry="${height * 0.34}" fill="hsl(${hue}, 70%, 55%)" fill-opacity="0.16"/>`)
    lines.push(`<ellipse cx="${width * 0.18}" cy="${height * 0.86}" rx="${width * 0.26}" ry="${height * 0.24}" fill="hsl(${(hue + 60) % 360}, 70%, 55%)" fill-opacity="0.12"/>`)

    // Frame
    lines.push(`<rect x="${padding * 0.5}" y="${padding * 0.5}" width="${width - padding}" height="${height - padding}" fill="none" stroke="${COLORS.pink}" stroke-opacity="0.28" stroke-width="2"/>`)

    // Badge
    if(badge)
    {
        const badgeWidth = Math.round(badge.length * badgeSize * 0.62) + badgeSize * 2
        const badgeY = Math.round(height * 0.12)
        lines.push(`<rect x="${padding}" y="${badgeY}" width="${badgeWidth}" height="${Math.round(badgeSize * 2.2)}" rx="${Math.round(badgeSize * 1.1)}" fill="none" stroke="${COLORS.pink}" stroke-opacity="0.75" stroke-width="2"/>`)
        lines.push(`<text x="${padding + badgeSize}" y="${badgeY + badgeSize * 1.55}" font-family="${BODY_FONT}" font-size="${badgeSize}" font-weight="700" letter-spacing="2" fill="${COLORS.pink}">${escapeXml(badge.toUpperCase())}</text>`)
    }

    // Title
    const titleY = Math.round(height * 0.56)
    lines.push(`<text x="${padding}" y="${titleY}" font-family="${CARD_FONT}" font-size="${titleSize}" font-weight="bold" fill="${COLORS.white}">${escapeXml(title)}</text>`)

    // Subtitle
    if(subtitle)
    {
        const words = subtitle.split(' ')
        const linesOut = []
        let current = ''
        const maxChars = Math.floor((width - padding * 2) / (subtitleSize * 0.52))

        for(const word of words)
        {
            if(current.length + word.length + 1 > maxChars && current)
            {
                linesOut.push(current)
                current = word
            }
            else
            {
                current = current ? `${current} ${word}` : word
            }
        }
        if(current)
            linesOut.push(current)

        linesOut.slice(0, 3).forEach((line, index) => {
            lines.push(`<text x="${padding}" y="${titleY + subtitleSize * 1.7 * (index + 1)}" font-family="${BODY_FONT}" font-size="${subtitleSize}" fill="${COLORS.pink}" fill-opacity="0.92">${escapeXml(line)}</text>`)
        })
    }

    // Corner mark
    lines.push(`<text x="${width - padding}" y="${height - padding * 0.7}" text-anchor="end" font-family="${BODY_FONT}" font-size="${Math.round(width * 0.018)}" letter-spacing="3" fill="${COLORS.pink}" fill-opacity="0.6">SAMS / ESOLVERBD</text>`)

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${lines.join('')}</svg>`
}

async function generateProjectImage(project, index, imageIndex)
{
    const width = 960
    const height = 540
    const hue = 255 + index * 28

    const badge = project.attributes?.with?.find((w) => /develop|progress|status/i.test(w)) ?? (imageIndex > 0 ? 'SCREENSHOT' : 'PROJECT')

    const svg = cardSvg({
        width,
        height,
        title: project.title,
        subtitle: project.description ?? `${project.title} - a project by Mohammad Sams Shahriar.`,
        badge,
        hue
    })

    const file = project.images[imageIndex]
    const out = path.join(STATIC, 'projects', 'images', file)
    await sharp(Buffer.from(svg)).flip().png().toFile(out)
    console.log(`  projects/images/${file}`)
}

async function generateLabImage(item, index, mini)
{
    const width = mini ? 480 : 960
    const height = mini ? 270 : 540
    const hue = 190 + index * 34

    const svg = cardSvg({
        width,
        height,
        title: item.title,
        subtitle: item.description ?? '',
        badge: item.status ?? 'EXPERIMENT',
        hue
    })

    const file = mini ? item.imageMini : item.image
    const out = path.join(STATIC, 'lab', 'images', file)
    await sharp(Buffer.from(svg)).flip().png().toFile(out)
    console.log(`  lab/images/${file}`)
}

/* ------------------------------------------------------------------ *
 * Share image (the picture link previews show)
 * ------------------------------------------------------------------ */

/**
 * 1200x630 is the size every social platform expects for a link preview.
 *
 * If you have a photo of yourself, drop it in as static/social/portrait.png
 * and it will be put on the right hand side of the card.
 */
async function generateShareImage()
{
    const width = 1200
    const height = 630

    const portraitPath = path.join(STATIC, 'social', 'portrait.png')
    const hasPortrait = fs.existsSync(portraitPath)

    const titleSize = 74
    const roleSize = 30

    const parts = []
    parts.push(`<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#191420"/>
            <stop offset="55%" stop-color="#251f2b"/>
            <stop offset="100%" stop-color="#120f18"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d66fff" stroke-opacity="0.10" stroke-width="1"/>
        </pattern>
    </defs>`)

    parts.push(`<rect width="${width}" height="${height}" fill="url(#bg)"/>`)
    parts.push(`<rect width="${width}" height="${height}" fill="url(#grid)"/>`)
    parts.push(`<ellipse cx="${width * 0.86}" cy="${height * 0.2}" rx="${width * 0.3}" ry="${height * 0.55}" fill="#d66fff" fill-opacity="0.14"/>`)
    parts.push(`<ellipse cx="${width * 0.08}" cy="${height * 0.95}" rx="${width * 0.26}" ry="${height * 0.42}" fill="#ffceca" fill-opacity="0.07"/>`)

    // Green band, same idea as the painted zone plates.
    parts.push(`<rect x="80" y="150" width="300" height="6" fill="${COLORS.green}"/>`)

    parts.push(`<text x="80" y="128" font-family="${TITLE_FONT}" font-size="22" font-weight="bold" letter-spacing="6" fill="${COLORS.green}">PORTFOLIO</text>`)
    parts.push(`<text x="80" y="248" font-family="${TITLE_FONT}" font-size="${titleSize}" font-weight="bold" fill="${COLORS.white}">${escapeXml(site.name)}</text>`)

    // Role, wrapped over two lines if it is too long.
    const roleWords = site.role.split(' ')
    const roleLines = []
    let current = ''
    const maxChars = 30
    for(const word of roleWords)
    {
        if(current.length + word.length + 1 > maxChars && current)
        {
            roleLines.push(current)
            current = word
        }
        else
        {
            current = current ? `${current} ${word}` : word
        }
    }
    if(current)
        roleLines.push(current)

    roleLines.slice(0, 2).forEach((line, index) => {
        parts.push(`<text x="80" y="${300 + index * (roleSize + 10)}" font-family="${BODY_FONT}" font-size="${roleSize}" fill="${COLORS.pink}">${escapeXml(line)}</text>`)
    })

    parts.push(`<text x="80" y="${height - 96}" font-family="${BODY_FONT}" font-size="24" fill="${COLORS.pink}" fill-opacity="0.9">${escapeXml(site.contact.website.replace('https://', ''))}</text>`)
    parts.push(`<text x="80" y="${height - 58}" font-family="${BODY_FONT}" font-size="21" fill="${COLORS.pink}" fill-opacity="0.6">${escapeXml(site.location)}</text>`)

    if(hasPortrait)
    {
        const portrait = await sharp(portraitPath).resize(340, 340, { fit: 'cover' }).toBuffer()
        const embedded = await sharp(portrait).png().toBuffer()
        parts.push(`<image x="${width - 430}" y="${(height - 340) / 2}" width="340" height="340" href="data:image/png;base64,${embedded.toString('base64')}"/>`)
        parts.push(`<rect x="${width - 430}" y="${(height - 340) / 2}" width="340" height="340" fill="none" stroke="${COLORS.pink}" stroke-opacity="0.4" stroke-width="3"/>`)
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join('')}</svg>`

    const out = path.join(STATIC, 'social', 'share-image.png')
    await sharp(Buffer.from(svg)).png().toFile(out)

    console.log(`  social/share-image.png (${width}x${height})${hasPortrait ? ' with portrait' : ''}`)
}

/* ------------------------------------------------------------------ *
 * Portrait (your photo on the contact card)
 * ------------------------------------------------------------------ */

/**
 * Only draws a placeholder. If you drop a real photo in as
 * static/social/portrait.png it is used as it is and never overwritten.
 */
async function generatePortrait()
{
    const out = path.join(STATIC, 'social', 'portrait.png')

    if(fs.existsSync(out))
    {
        console.log('  social/portrait.png already exists, leaving it alone')
        return
    }

    const size = 600
    const initials = site.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('')

    const fontSize = 200

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#251f2b"/>
                <stop offset="100%" stop-color="#120f18"/>
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#bg)"/>
        <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.3}" fill="#d66fff" fill-opacity="0.18"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
              font-family="${TITLE_FONT}" font-size="${fontSize}" font-weight="bold"
              fill="${COLORS.pink}">${escapeXml(initials)}</text>
        <rect x="20" y="20" width="${size - 40}" height="${size - 40}" fill="none"
              stroke="${COLORS.green}" stroke-opacity="0.5" stroke-width="3"/>
    </svg>`

    await sharp(Buffer.from(svg)).png().toFile(out)

    console.log(`  social/portrait.png (${size}x${size} placeholder - replace it with your photo)`)
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

console.log('Generating zone labels...')
for(const zone of site.zones.career)
    await generateCareerLabel(zone)

console.log('\nGenerating project images...')
for(let i = 0; i < projects.length; i++)
{
    for(let j = 0; j < projects[i].images.length; j++)
        await generateProjectImage(projects[i], i, j)
}

console.log('\nGenerating lab images...')
for(let i = 0; i < lab.length; i++)
{
    await generateLabImage(lab[i], i, false)
    await generateLabImage(lab[i], i, true)
}

console.log('\nGenerating the share image...')
await generateShareImage()

console.log('\nGenerating the portrait...')
await generatePortrait()

console.log('\nDone.')
