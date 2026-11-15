import fs from 'node:fs'
function load(file){
  const b = fs.readFileSync(file)
  let off=12, json=null
  while(off<b.length){ const len=b.readUInt32LE(off); const type=b.readUInt32LE(off+4); if(type===0x4e4f534a) json=JSON.parse(b.subarray(off+8,off+8+len).toString('utf8')); off+=8+len+((4-(len%4))%4) }
  return json
}
const o = load('static/areas/_original.glb')
const p = load('static/areas/areas.glb')
console.log('original nodes', o.nodes.length, 'patched nodes', p.nodes.length)
const removed = ['blueskyPhysicalDynamic.001','discordPhysicalDynamic','onlyfansPhysicalDynamic','twitchPhysicalDynamic','xPhysicalDynamic','youtubePhysicalDynamic','baguiraPhysicalDynamic','boyPhysicalDynamic','sudoPhysicalDynamic']
console.log('\nremoved node indices (original):')
removed.forEach(n => { const i = o.nodes.findIndex(x=>x.name===n); console.log('  ', n, '=', i, 'children=', o.nodes[i]? (o.nodes[i].children||[]).join(','):'-') })
console.log('\nrefOnlyFans original index:', o.nodes.findIndex(x=>x.name==='refOnlyFans'))
const oi = o.nodes.findIndex(x=>x.name==='refOnlyFans')
console.log('  original refOnlyFans node:', JSON.stringify(o.nodes[oi]))
console.log('\nparent of refOnlyFans in original:')
o.nodes.forEach((n,i)=>{ if((n.children||[]).includes(oi)) console.log('  ', n.name, '(index '+i+')') })
console.log('\npatched: refOnlyFans present?', p.nodes.some(x=>x.name==='refOnlyFans'))
