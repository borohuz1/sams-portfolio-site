import * as THREE from 'three/webgpu'
import site from './site.js'

const text = `
  M O H A M M A D   S A M S   S H A H R I A R

  Multidisciplinary Technical & Digital Professional
  Khilgaon, Dhaka 1219, Bangladesh

  mail : ${site.contact.email}
  site : ${site.contact.website}

  Zones:
${site.zones.career.map((zone) => `    ${zone.title.padEnd(18)} => ${zone.subtitle}`).join('\n')}

  Press [V] for free camera. #debug in the URL for the debug panel.

  Three.js ${THREE.REVISION} - created by mr.doob and the Three.js community.
  Built on the MIT-licensed folio-2025 starter (attribution in NOTICE.md).
`

const style = 'color: #ffffff; font: 400 1em monospace;'

export default [ `%c${text}`, style ]
