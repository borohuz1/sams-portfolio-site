import * as THREE from 'three/webgpu'
import site from './site.js'

const text = `
███████╗ █████╗ ███╗   ███╗███████╗
██╔════╝██╔══██╗████╗ ████║██╔════╝
███████╗███████║██╔████╔██║█████╗  
╚════██║██╔══██║██║╚██╔╝██║██╔══╝  
███████║██║  ██║██║ ╚═╝ ██║███████╗
╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

╔═ Welcome ═════════════╗
║ ${site.name}
║ ${site.role}
║ ${site.location}
╚═══════════════════════╝

╔═ Socials ══════════════╗
║ Mail        ⇒ ${site.contact.email}
║ Phone       ⇒ ${site.contact.phones[0].number}
║ WhatsApp    ⇒ ${site.contact.phones[1].number}
║ LinkedIn    ⇒ ${site.contact.linkedin}
║ GitHub      ⇒ ${site.contact.github}
║ Agency      ⇒ ${site.contact.website}
╚═══════════════════════╝

╔═ Zones ════════════════╗
${site.zones.career.map((zone) => `║ ${zone.title.padEnd(22)} ⇒ ${zone.subtitle}`).join('\n')}
╚═══════════════════════╝

╔═ Debug ════════════════╗
║ You can access the debug mode by adding #debug at the end of the URL and reloading.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ Three.js ════════════╗
║ Three.js is the library I'm using to render this 3D world (release: ${THREE.REVISION})
║ https://threejs.org/
║ It was created by mr.doob (https://x.com/mrdoob, https://github.com/mrdoob),
║ followed by hundreds of awesome developers,
║ one of which being Sunag (https://x.com/sea3dformat, https://github.com/sunag) who added TSL,
║ enabling the use of both WebGL and WebGPU, making this portfolio possible.
╚═══════════════════════╝

╔═ Source code ═════════╗
║ The code is available on GitHub under MIT license.
║ https://github.com/sams-shahriar/drivable-portfolio
║ Built on the MIT-licensed folio-2025 by Bruno Simon, who made the original
║ drivable portfolio. All credit for the world, the car and the engine goes to him.
╚═══════════════════════╝

╔═ Musics ══════════════╗
║ The music you hear was made especially for the original portfolio by the awesome Kounine (Linktree).
║ https://linktr.ee/Kounine
║ They are now under CC0 license, meaning you can do whatever you want with them!
╚═══════════════════════╝

╔═ Some more links ═════╗
║ Rapier (Physics library)  ⇒ https://rapier.rs/
║ Howler.js (Audio library) ⇒ https://howlerjs.com/
║ Amatic SC (Fonts)         ⇒ https://fonts.google.com/specimen/Amatic+SC
║ Nunito (Fonts).           ⇒ https://fonts.google.com/specimen/Nunito?query=Nunito
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]
