import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('areas-dump.json','utf8'))
const byName = new Map(d.map(n=>[n.name,n]))
const parent = new Map()
for(const n of d) for(const c of n.children) parent.set(c, n.name)
const t = byName.get('refLettersPhysicalDynamic.010')
console.log('refLettersPhysicalDynamic.010 parent =', parent.get('refLettersPhysicalDynamic.010'))
const p = byName.get(parent.get('refLettersPhysicalDynamic.010'))
console.log('grandparent =', parent.get(p.name), ' children=', p.children.join(','))
console.log('\n=== nodes whose name is 1-3 chars (letters) ===')
for(const n of d){ if(n.name.length <= 3 && n.name.match(/^[A-Za-z][A-Za-z.0-9]*$/)) console.log('  ', n.name.padEnd(10), 'parent=', parent.get(n.name), 't=', JSON.stringify(n.t), 's=', JSON.stringify(n.s)) }
console.log('\n=== landing group children ===')
const l = byName.get('landing')
if(l) console.log(l.children.join(', '))
