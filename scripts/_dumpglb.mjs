import { NodeIO } from '@gltf-transform/core'
import fs from 'node:fs'
import path from 'node:path'

const io = new NodeIO()
const file = path.resolve(process.argv[2] ?? 'static/areas/areas.glb')
const doc = await io.read(file)
const root = doc.getRoot()

const out = []
root.listNodes().forEach((node) => {
    const t = node.getTranslation()
    const s = node.getScale()
    out.push({
        name: node.getName(),
        extras: node.getExtras() && Object.keys(node.getExtras()).length ? node.getExtras() : null,
        t: [ +t[0].toFixed(3), +t[1].toFixed(3), +t[2].toFixed(3) ],
        s: [ +s[0].toFixed(3), +s[1].toFixed(3), +s[2].toFixed(3) ],
        children: node.listChildren().map((c) => c.getName()),
    })
})

fs.writeFileSync('areas-dump.json', JSON.stringify(out, null, 2))
console.log('Wrote areas-dump.json', out.length, 'nodes')
