/**
 * Builds static/areas/areas.glb from the pristine original.
 *
 * Two jobs:
 *   1. Point the six career stone slabs at this portfolio's own zone textures.
 *   2. Remove the props that belong to the original author, so the island does
 *      not ship somebody else's face, name, social accounts or characters.
 *
 * The GLB is edited at the JSON chunk level only. Buffers, meshes and every
 * other extension are copied through byte for byte, so the rendering cannot
 * change.
 *
 * The script always starts from resources/areas-original.glb (the untouched
 * original), so it can be re-run as many times as you like and always produces
 * the same result.
 *
 * Run with: node scripts/patch-areas.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const TARGET = path.resolve('static/areas/areas.glb')
const ORIGINAL = path.resolve('resources/areas-original.glb')

/** Career slab -> zone texture. Ordered oldest to newest along the walk. */
const CAREER_TEXTURES = {
    'refLine': 'careerWorkshop',
    'refLine.004': 'careerOffice',
    'refLine.001': 'careerFactory',
    'refLine.005': 'careerStudio',
    'refLine.002': 'careerPlayground',
    'refLine.003': 'careerAgency'
}

/**
 * Props that belong to the original author and must not ship.
 *
 * The social icons around the statue point at the original author's accounts,
 * so the ones for platforms that are not used here are removed. The mail
 * envelope, the GitHub mark and the LinkedIn mark are kept, because this
 * portfolio links to all three.
 *
 * `refOnlyFans` is kept as well: it is an empty marker that says where the
 * fans pop up, it carries no branding.
 *
 * The second group are the original author's character models.
 */
const NODES_TO_REMOVE = new Set([
    // Social icons for platforms this portfolio does not use
    'blueskyPhysicalDynamic.001',
    'discordPhysicalDynamic',
    'onlyfansPhysicalDynamic',
    'twitchPhysicalDynamic',
    'xPhysicalDynamic',
    'youtubePhysicalDynamic',

    // The original author's characters
    'baguiraPhysicalDynamic',
    'baguiraMesh.001',
    'boyPhysicalDynamic',
    'boyMesh',
    'sudoPhysicalDynamic',
    'sudoMesh.003',
    'wings'
])

/** Nodes that must survive the patch. The script fails if any of them goes. */
const NODES_TO_KEEP = [
    'refOnlyFans',
    'refFan',
    'refCenter',
    'refStatuePhysicalDynamic',
    'mailPhysicalDynamic',
    'gitHubPhysicalDynamic',
    'linkedInPhysicalDynamic',
    'socialArrayReference'
]

// --- Pristine original ---------------------------------------------------

if(!fs.existsSync(ORIGINAL))
{
    throw new Error(
        `Missing ${path.relative(process.cwd(), ORIGINAL)}.\n` +
        'Get the untouched original from https://github.com/brunosimon/folio-2025 ' +
        '(static/areas/areas.glb) and put it there, then run this script again.'
    )
}

// --- GLB container -------------------------------------------------------

const buffer = fs.readFileSync(ORIGINAL)

const magic = buffer.readUInt32LE(0)
if (magic !== 0x46546c67)
    throw new Error('Not a GLB file')

let offset = 12
let jsonChunk = null
let binChunk = null

while (offset < buffer.length)
{
    const length = buffer.readUInt32LE(offset)
    const type = buffer.readUInt32LE(offset + 4)
    const data = buffer.subarray(offset + 8, offset + 8 + length)

    if (type === 0x4e4f534a) jsonChunk = data
    else if (type === 0x004e4942) binChunk = data

    offset += 8 + length + ((4 - (length % 4)) % 4)
}

if (!jsonChunk)
    throw new Error('No JSON chunk found')

const json = JSON.parse(jsonChunk.toString('utf8'))

// --- Patch ---------------------------------------------------------------

let renamed = 0

const originalNodeCount = json.nodes.length
const removedIndexes = new Set()

json.nodes.forEach((node, index) => {
    if (NODES_TO_REMOVE.has(node.name))
        removedIndexes.add(index)
})

json.nodes.forEach((node) => {
    const texture = CAREER_TEXTURES[node.name]
    if (texture)
    {
        node.extras = { ...(node.extras || {}), texture }
        renamed++
    }
})

// Detach removed nodes from their parents and from the scenes.
json.nodes.forEach((node) => {
    if (node.children)
    {
        node.children = node.children.filter((child) => !removedIndexes.has(child))
    }
})

json.scenes.forEach((scene) => {
    if (scene.nodes)
    {
        scene.nodes = scene.nodes.filter((node) => !removedIndexes.has(node))
    }
})

// Drop the nodes themselves.
json.nodes = json.nodes.filter((_, index) => !removedIndexes.has(index))

const removed = removedIndexes.size

// Every node index after a removed one shifts down, so fix every reference
// that points at the node list. Mesh / camera / skin indices live in their own
// arrays and must not be touched.
const oldToNew = new Map()
{
    let newIndex = 0
    for (let oldIndex = 0; oldIndex < originalNodeCount; oldIndex++)
    {
        if (removedIndexes.has(oldIndex))
            continue
        oldToNew.set(oldIndex, newIndex++)
    }
}

const remap = (index) => {
    const mapped = oldToNew.get(index)
    if (mapped === undefined)
        throw new Error(`Reference to removed node ${index}`)
    return mapped
}

json.nodes.forEach((node) => {
    if (node.children)
        node.children = node.children.map(remap)
})

json.scenes.forEach((scene) => {
    if (scene.nodes)
        scene.nodes = scene.nodes.map(remap)
})

if (json.skins)
{
    json.skins.forEach((skin) => {
        if (skin.joints)
            skin.joints = skin.joints.map(remap)

        // The skeleton root is a node reference too.
        if (typeof skin.skeleton === 'number')
            skin.skeleton = remap(skin.skeleton)
    })
}

if (json.animations)
{
    json.animations.forEach((animation) => {
        if (animation.channels)
        {
            animation.channels.forEach((channel) => {
                if (channel.target && channel.target.node !== undefined)
                    channel.target.node = remap(channel.target.node)
            })
        }
    })
}

// --- Verify --------------------------------------------------------------

const finalNames = new Set(json.nodes.map((node) => node.name))

for (const name of NODES_TO_KEEP)
{
    if (!finalNames.has(name))
        throw new Error(`Patch removed "${name}", which has to stay.`)
}

for (const name of NODES_TO_REMOVE)
{
    if (finalNames.has(name))
        throw new Error(`Patch kept "${name}", which has to go.`)
}

for (const [ node, texture ] of Object.entries(CAREER_TEXTURES))
{
    const found = json.nodes.find((n) => n.name === node)
    if (!found || found.extras?.texture !== texture)
        throw new Error(`Career slab "${node}" was not pointed at "${texture}".`)
}

// --- Write ---------------------------------------------------------------

const newJson = Buffer.from(JSON.stringify(json), 'utf8')
const newJsonPadded = Buffer.concat([ newJson, Buffer.alloc((4 - (newJson.length % 4)) % 4, 0x20) ])

const header = Buffer.alloc(12)
header.writeUInt32LE(0x46546c67, 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + newJsonPadded.length + (binChunk ? 8 + binChunk.length : 0), 8)

const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(newJsonPadded.length, 0)
jsonHeader.writeUInt32LE(0x4e4f534a, 4)

const parts = [ header, jsonHeader, newJsonPadded ]

if (binChunk)
{
    const binHeader = Buffer.alloc(8)
    binHeader.writeUInt32LE(binChunk.length, 0)
    binHeader.writeUInt32LE(0x004e4942, 4)
    parts.push(binHeader, binChunk)
}

fs.mkdirSync(path.dirname(TARGET), { recursive: true })
fs.writeFileSync(TARGET, Buffer.concat(parts))

console.log(
    `Patched ${path.basename(TARGET)}: ${renamed} career slabs renamed, ` +
    `${removed} nodes removed, ${json.nodes.length} nodes left.`
)
