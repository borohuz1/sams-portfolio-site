import fs from 'node:fs'
function load(file){ const b=fs.readFileSync(file); let off=12,json=null; while(off<b.length){ const len=b.readUInt32LE(off); const type=b.readUInt32LE(off+4); if(type===0x4e4f534a) json=JSON.parse(b.subarray(off+8,off+8+len).toString('utf8')); off+=8+len+((4-(len%4))%4) } return json }
const p = load('static/areas/areas.glb')
console.log('nodes:', p.nodes.length)
for(const n of p.nodes){ if(/^refLine/.test(n.name)) console.log('  ', n.name, JSON.stringify(n.extras)) }
console.log('has gitHub:', p.nodes.some(x=>x.name==='gitHubPhysicalDynamic'))
