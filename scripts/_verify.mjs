import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('areas-dump.json','utf8'))
console.log('=== career lines after patch ===')
for(const n of d){ if(/^refLine/.test(n.name)) console.log(' ', n.name.padEnd(14), JSON.stringify(n.extras)) }
console.log('=== removed check ===')
for(const nm of ['blueskyPhysicalDynamic.001','discordPhysicalDynamic','onlyfansPhysicalDynamic','twitchPhysicalDynamic','xPhysicalDynamic','youtubePhysicalDynamic','baguiraPhysicalDynamic','boyPhysicalDynamic','sudoPhysicalDynamic','mailPhysicalDynamic','gitHubPhysicalDynamic','linkedInPhysicalDynamic'])
  console.log(' ', nm.padEnd(30), d.some(x=>x.name===nm) ? 'PRESENT' : 'removed')
