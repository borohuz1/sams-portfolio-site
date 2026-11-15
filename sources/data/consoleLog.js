import * as THREE from 'three/webgpu'
import site from './site.js'

// Simple console banner. Kept rough but readable.
const text = `
 __ _ __ __ __ __ __ _ __  _   _  ___
/ __/\\ '__/ \\/ /| |/ _`/| |  | |/ __/
\\__ \\| |  >  < | | (_| | |__| |\\__ \\
\\__|__/\\_\\/\\_\\/ |_|\\__,_|\\__,_|/___/

Mohammad Sams Shahriar
   Multidisciplinary Technical & Digital Professional
   Khilgaon, Dhaka 1219, Bangladesh

mail : ${site.contact.email}
site : ${site.contact.website}

Zones:
${site.zones.career.map((zone) => `   ${zone.title.padEnd(18)} => ${zone.subtitle}`).join('\n')}

Press [V] for free camera. #debug in the URL for the debug panel.

Three.js ${THREE.REVISION}  - created by mr.doob and the Three.js community.
Built on the MIT-licensed folio-2025 starter (attribution in NOTICE.md).
`

const style = 'color: #ffffff; font: 400 1em monospace;'

export default [ `%c${text}`, style ]
