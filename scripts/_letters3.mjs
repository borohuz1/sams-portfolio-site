import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('areas-dump.json','utf8'))
console.log('=== all node names containing "etter" ===')
d.filter(n=>/etter/.test(n.name)).forEach(n=>console.log('  ', n.name, 'children=', (n.children||[]).join(',')))
console.log('\n=== reference keys that resolve to "letters" ===')
const re=/^ref(?:erence)?([^0-9]+)([0-9]+)?$/
d.forEach(n=>{ const m=n.name.match(re); if(m){ const k=m[1].charAt(0).toLowerCase()+m[1].slice(1); if(k.toLowerCase().startsWith('letter')) console.log('  ', n.name, '->', JSON.stringify(k)) } })
