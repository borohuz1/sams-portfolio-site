import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('areas-dump.json','utf8'))
const parent = new Map()
for(const n of d) for(const c of n.children) parent.set(c, n.name)
const targets = ['blueskyPhysicalDynamic.001','discordPhysicalDynamic','onlyfansPhysicalDynamic','twitchPhysicalDynamic','xPhysicalDynamic','youtubePhysicalDynamic','baguiraPhysicalDynamic','boyPhysicalDynamic','sudoPhysicalDynamic']
for(const t of targets){
  const n = d.find(x=>x.name===t)
  console.log('\n### '+t+' (parent='+(parent.get(t)||'ROOT')+') children:')
  for(const c of (n?n.children:[])){
    const cn = d.find(x=>x.name===c)
    console.log('   -', c, '-> children:', cn? cn.children.join(','):'?')
  }
}
console.log('\n### social children now:')
const soc = d.find(x=>x.name==='social')
console.log(soc.children.join(', '))
