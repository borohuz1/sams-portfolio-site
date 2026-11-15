/**
 * Lists the nodes that are actually reachable from a scene in a GLB.
 *
 * Nodes that exist in the file but are not attached to a scene are dead weight
 * and never show up in the game. This script tells the two apart.
 *
 * Run with: node scripts/_scene-check.mjs [path/to/file.glb]
 */

import { NodeIO } from '@gltf-transform/core'
import path from 'node:path'

const io = new NodeIO()
const file = path.resolve(process.argv[2] ?? 'static/areas/areas.glb')
const doc = await io.read(file)
const root = doc.getRoot()

const reachable = new Set()

for(const scene of root.listScenes())
{
    for(const node of scene.listChildren())
    {
        const stack = [ node ]
        while(stack.length)
        {
            const current = stack.pop()
            if(reachable.has(current))
                continue

            reachable.add(current)
            stack.push(...current.listChildren())
        }
    }
}

const all = root.listNodes()
const orphans = all.filter((node) => !reachable.has(node))

console.log(`file: ${file}`)
console.log(`nodes in file: ${all.length}`)
console.log(`nodes in scene: ${reachable.size}`)
console.log(`orphan nodes: ${orphans.length}`)

console.log('')
console.log('=== orphan nodes (never rendered) ===')
for(const node of orphans)
    console.log(`  ${node.getName()}`)

console.log('')
console.log('=== scene nodes matching the original author props ===')
const pattern = /mail|gitHub|linkedIn|onlyFans|onlyfans|discord|twitch|bluesky|youtube|baguira|boy|sudo|PhysicalDynamic\.\d+$/i
for(const node of reachable)
{
    if(pattern.test(node.getName()))
        console.log(`  ${node.getName()}`)
}
