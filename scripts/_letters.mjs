import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('areas-dump.json','utf8'))
const parent = new Map()
for(const n of d) for(const c of n.children) parent.set(c, n.name)
console.log('=== letter-ish nodes ===')
for(const n of d){ if(/letter|text|letter/i.test(n.name)) console.log(' ', n.name.padEnd(34), 'parent=', parent.get(n), 't=', JSON.stringify(n.t), 'children=', (n.children||[]).join(',')) }
console.log('\n=== meshes named with letters ===')
const names = d.filter(n=>/^refLetters/i.test(n.name)).map(n=>n.name)
console.log(names.join(', '))
