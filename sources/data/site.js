/**
 * Master content file for the portfolio.
 *
 * Everything a visitor reads (name, role, bio, zones, tools, contact details)
 * lives here. Edit this file and the whole site updates.
 *
 * `docs/CONTENT.md` has a short guide to every field.
 */

export default {
    /** Identity */
    name: 'Mohammad Sams Shahriar',
    shortName: 'Sams',
    role: 'Multidisciplinary Technical & Digital Professional',
    location: 'Khilgaon, Dhaka 1219, Bangladesh',

    /** The window title that appears when you enter the world */
    siteTitle: "Sams' Home",

    /** Short paragraph shown under the title on the home panel */
    intro:
        'I connect technical work, business operations and digital creativity. ' +
        'I have about 2.5 years in CNC design, about 1 year in ISP accounting, and practical ' +
        'business experience in garment manufacturing. I am also building EsolverBD, a digital ' +
        'agency for small businesses and startups in Bangladesh.',

    /** Longer, honest description of how to explore the world */
    guide:
        'This is my portfolio. Drive around the island to visit each of my zones and learn what I do. ' +
        'And do not break anything!',

    /**
     * The physical zones of the world.
     *
     * `career` zones are the stone slabs you drive past in the career area, ordered
     * from oldest (first) to newest (last). `lab` and `contact` are their own areas.
     */
    zones: {
        career: [
            {
                id: 'workshop',
                title: 'WORKSHOP',
                subtitle: 'CNC & CAD',
                texture: 'careerWorkshop',
                period: '2.5 years',
                description:
                    'About 2.5 years of CNC design: CAD drafting, technical drawing, 3D modeling and ' +
                    'turning a part idea into something a machine can actually cut.',
                tools: [ 'AutoCAD', 'CNC design', 'CAD drafting', '3D modeling' ]
            },
            {
                id: 'office',
                title: 'OFFICE',
                subtitle: 'ACCOUNTS & ISP',
                texture: 'careerOffice',
                period: '1 year',
                description:
                    'About a year of ISP accounting: bookkeeping, Excel sheets, invoices, customer ' +
                    'records and the daily admin that keeps an office running.',
                tools: [ 'Accounting', 'Excel', 'ISP operations' ]
            },
            {
                id: 'factory',
                title: 'FACTORY',
                subtitle: 'GARMENT MFG',
                texture: 'careerFactory',
                period: 'Ongoing',
                description:
                    'Garment manufacturing, production planning and B2B work. Learning how a real ' +
                    'factory floor runs, from sample to shipment.',
                tools: [ 'Production planning', 'B2B', 'Quality checks' ]
            },
            {
                id: 'studio',
                title: 'STUDIO',
                subtitle: 'AI, CGI & EDIT|GRAPHIC DESIGN',
                texture: 'careerStudio',
                period: 'Creative work',
                description:
                    'AI video and image generation, CGI ad concepts, video editing and graphic ' +
                    'design. Making brand ideas that can actually be shot or shipped.',
                tools: [ 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro' ]
            },
            {
                id: 'playground',
                title: 'PLAYGROUND',
                subtitle: 'ROBLOX DEV',
                texture: 'careerPlayground',
                period: 'In development',
                description:
                    'Roblox game development: frame-exact combat animation, server-authoritative ' +
                    'damage and arena design. Still in development, shown as it is.',
                tools: [ 'Luau', 'Roblox Studio', 'Combat design' ]
            },
            {
                id: 'agency',
                title: 'AGENCY',
                subtitle: 'ESOLVERBD|DIGITAL AGENCY',
                texture: 'careerAgency',
                period: 'Current',
                description:
                    'EsolverBD is my digital agency for small businesses and startups in Bangladesh: ' +
                    'websites, social media, ads, e-commerce and automation planning.',
                tools: [ 'Websites', 'Social media', 'Ads', 'E-commerce', 'Automation' ]
            }
        ]
    },

    /** The year the counter starts from, and how many years it sweeps through */
    career: {
        startYear: 2022,
        totalYears: 4
    },

    /**
     * Tools, honestly labelled.
     * status: 'daily' = part of my regular work, 'learning' = I am working on it.
     */
    tools: [
        { name: 'AutoCAD', status: 'daily' },
        { name: 'Blender', status: 'daily' },
        { name: 'Photoshop', status: 'daily' },
        { name: 'Illustrator', status: 'daily' },
        { name: 'Three.js', status: 'daily' },
        { name: 'After Effects', status: 'daily' },
        { name: 'Premiere Pro', status: 'daily' },
        { name: '3ds Max', status: 'learning' },
        { name: 'React', status: 'learning' }
    ],

    /** Contact details */
    contact: {
        email: 'samsspy01@gmail.com',
        phones: [
            { label: 'Phone', number: '01617541939' },
            { label: 'WhatsApp', number: '01853397899' }
        ],
        address: 'Khilgaon, Dhaka 1219, Bangladesh',
        linkedin: 'https://linkedin.com/in/sams-shahriar',
        github: 'https://github.com/sams-shahriar',
        website: 'https://esolver.site'
    },

    /** Where this site will live once published */
    siteUrl: 'https://borohuz1.github.io/drivable-portfolio/',

    /**
     * Behind the scene panel.
     * `html` is inserted as-is so links and <strong> work.
     */
    behindTheScene: {
        title: 'Behind the scene',
        intro:
            'Thank you for visiting my portfolio! If you are curious about the stack and how this ' +
            'project was built, here is everything you need to know.',
        sections: [
            {
                title: 'What this is',
                html:
                    'A small 3D island you drive a car around. Everything you can read is placed in the ' +
                    'world: my zones are stone slabs you drive past, my projects are screens in the ' +
                    'workshop, my experiments are in the lab, and my contact details are by the statue.' +
                    '<br />The point is not to scroll a page. It is to visit a place.'
            },
            {
                title: 'The stack',
                html:
                    '<a href="https://threejs.org" target="_blank" rel="noreferrer">Three.js</a> renders ' +
                    'the world. It was created by <strong>mr.doob</strong> ' +
                    '(<a href="http://github.com/mrdoob" target="_blank" rel="noreferrer">GitHub</a>), ' +
                    'and <strong>Sunag</strong> ' +
                    '(<a href="http://github.com/sunag" target="_blank" rel="noreferrer">GitHub</a>) ' +
                    'added <a href="https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language" ' +
                    'target="_blank" rel="noreferrer">TSL</a>, which lets the same shaders run on WebGPU ' +
                    'and WebGL.' +
                    '<br />Physics is <a href="https://rapier.rs" target="_blank" rel="noreferrer">Rapier</a>, ' +
                    'audio is <a href="https://howlerjs.com" target="_blank" rel="noreferrer">Howler.js</a>, ' +
                    'and the fonts are <a href="https://fonts.google.com/specimen/Amatic+SC" ' +
                    'target="_blank" rel="noreferrer">Amatic SC</a> and ' +
                    '<a href="https://fonts.google.com/specimen/Nunito" target="_blank" rel="noreferrer">Nunito</a>.'
            },
            {
                title: 'Source code',
                html:
                    'The code is on <a href="https://github.com/sams-shahriar/drivable-portfolio" ' +
                    'target="_blank" rel="noreferrer">GitHub</a> under an ' +
                    '<a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noreferrer">MIT license</a>.' +
                    '<br />This project started from the MIT-licensed ' +
                    '<a href="https://github.com/brunosimon/folio-2025" target="_blank" rel="noreferrer">' +
                    'folio-2025</a> by Bruno Simon, who made the original drivable portfolio. All credit ' +
                    'for the world, the car and the engine goes to him and the Three.js community.'
            },
            {
                title: 'Musics',
                html:
                    'The music you hear was made for the original portfolio by the awesome Kounine ' +
                    '(<a href="https://linktr.ee/Kounine" target="_blank" rel="noreferrer">Linktree</a>). ' +
                    'It is published under a ' +
                    '<a href="https://choosealicense.com/licenses/cc0-1.0/" target="_blank" rel="noreferrer">' +
                    'CC0 license</a>, so you can use it however you like.'
            }
        ],
        signOff: 'Sams'
    }
}
