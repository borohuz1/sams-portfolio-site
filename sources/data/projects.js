/**
 * Projects shown in the workshop area (the screens you walk up to).
 *
 * Each entry needs:
 *   title       - full name
 *   titleSmall  - words shown on the small 3D sign (array of lines)
 *   url         - where the "visit project" link goes
 *   attributes  - the little text rows under the title (role / at / with)
 *   images      - file names inside static/projects/images/
 *
 * Images are 960x540 PNGs. Drop your own screenshot in that folder, name it the
 * same way, and it shows up on the screen automatically.
 */

export default [
    {
        title: 'Sentinel Siege',
        titleSmall: [ 'Sentinel', 'Siege' ],
        url: 'https://github.com/sams-shahriar',
        description: 'A local-first desktop agent that sees your screen, points at the exact control you need, and can drive the mouse and keyboard for you.',
        attributes:
        {
            role: [ 'Solo developer' ],
            with: [ 'Local-first', 'Windows' ]
        },
        distinctions: [],
        images:
        [
            'sentinel-siege-1.png',
            'sentinel-siege-2.png',
        ]
    },
    {
        title: 'Shadows of Aetheria',
        titleSmall: [ 'Shadows', 'of Aetheria' ],
        url: 'https://github.com/sams-shahriar',
        description: 'A Roblox boss-fight combat slice: server-authoritative damage, a frame-exact 3-hit light attack combo and a full arena loop.',
        attributes:
        {
            role: [ 'Solo developer' ],
            with: [ 'Roblox', 'In development' ]
        },
        distinctions: [],
        images:
        [
            'shadows-of-aetheria-1.png',
            'shadows-of-aetheria-2.png',
        ]
    },
    {
        title: 'Void Fall',
        titleSmall: [ 'Void', 'Fall' ],
        url: 'https://github.com/sams-shahriar',
        description: 'The UI slice of a co-op extraction shooter: lobby, combat HUD, downed state, boss phases and post-match screens.',
        attributes:
        {
            role: [ 'Solo developer' ],
            with: [ 'Roblox', 'UI slice' ]
        },
        distinctions: [],
        images:
        [
            'void-fall-1.png',
        ]
    },
    {
        title: 'Business Desk',
        titleSmall: [ 'Business', 'Desk' ],
        url: 'https://github.com/sams-shahriar',
        description: 'An offline shop book for daily sales, orders, payments and customer credit. One HTML file, no install, data stays on your machine.',
        attributes:
        {
            role: [ 'Solo developer' ],
            with: [ 'Offline tool', 'HTML' ]
        },
        distinctions: [],
        images:
        [
            'business-desk-1.png',
            'business-desk-2.png',
        ]
    },
    {
        title: 'EsolverBD',
        titleSmall: [ 'EsolverBD' ],
        url: 'https://esolver.site',
        description: 'A digital agency for small businesses and startups in Bangladesh: websites, social media, ads, e-commerce and automation planning.',
        attributes:
        {
            role: [ 'Founder' ],
            with: [ 'Digital agency', 'Bangladesh' ]
        },
        distinctions: [],
        images:
        [
            'esolverbd-1.png',
        ]
    }
]
