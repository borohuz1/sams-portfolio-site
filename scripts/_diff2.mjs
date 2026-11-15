import fs from 'node:fs'
function load(file){
  const b = fs.readFileSync(file)
  let off=12, json=null
  while(off<b.length){ const len=b.readUInt32LE(off); const type=b.readUInt32LE(off+4); if(type===0x4e4f534a) json=JSON.parse(b.subarray(off+8,off+8+len).toString('utf8')); off+=8+len+((4-(len%4))%4) }
  return json
}
const o = load('static/areas/_original.glb')
const p = load('static/areas/areas.glb')
const oNames = o.nodes.map(n=>n.name)
const pNames = new Set(p.nodes.map(n=>n.name))
console.log('=== nodes in ORIGINAL but not in PATCHED ===')
o.nodes.forEach((n,i)=>{ if(!pNames.has(n.name)) console.log('  ', String(i).padStart(3), n.name) })
console.log('\n=== patched social children ===')
const pSoc = p.nodes.find(x=>x.name==='social')
console.log(pSoc.children.map(c=>p.nodes[c] ? p.nodes[c].name : '?').join(', '))
console.log('\n=== patched scene root count:', p.scenes[0].nodes.length, ' original:', o.scenes[0].nodes.length)
