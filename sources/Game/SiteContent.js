import site from '../data/site.js'

/**
 * Fills the parts of the interface that read from `sources/data/site.js`.
 *
 * The HTML only carries the shell, the words come from the data file so that
 * changing a name or a project only means editing one place.
 */
export class SiteContent
{
    constructor()
    {
        this.setTitle()
        this.setIntro()
        this.setZones()
        this.setTools()
    }

    setTitle()
    {
        const element = document.querySelector('.js-site-title')
        if(element)
            element.textContent = site.siteTitle
    }

    setIntro()
    {
        const element = document.querySelector('.js-site-intro')
        if(element)
            element.textContent = site.intro
    }

    setZones()
    {
        const list = document.querySelector('.js-zones-list')
        if(!list)
            return

        const zones = [
            ...site.zones.career.map((zone) => ({
                name: zone.title.charAt(0) + zone.title.slice(1).toLowerCase(),
                detail: zone.subtitle.replace(/\|/g, ' / '),
                description: zone.description,
                period: zone.period
            })),
            {
                name: 'Lab',
                detail: 'Experiments',
                description: 'Roblox games, AI video tests, CGI concepts and 3D web prototypes.',
                period: 'In progress'
            },
            {
                name: 'Contact',
                detail: 'Say hello',
                description: 'Email, phone, WhatsApp, LinkedIn and EsolverBD. Find the markers by the statue.',
                period: 'Open'
            }
        ]

        list.innerHTML = ''

        for(const zone of zones)
        {
            const item = document.createElement('li')
            item.className = 'zone'

            const name = document.createElement('strong')
            name.textContent = zone.name
            item.appendChild(name)

            const detail = document.createElement('span')
            detail.className = 'zone-detail'
            detail.textContent = ` — ${zone.detail}`
            item.appendChild(detail)

            const period = document.createElement('span')
            period.className = 'zone-period'
            period.textContent = zone.period
            item.appendChild(period)

            const description = document.createElement('span')
            description.className = 'zone-description'
            description.textContent = zone.description
            item.appendChild(description)

            list.appendChild(item)
        }
    }

    setTools()
    {
        const list = document.querySelector('.js-tools-list')
        if(!list)
            return

        list.innerHTML = ''

        for(const tool of site.tools)
        {
            const item = document.createElement('li')
            item.className = `tool is-${tool.status}`

            const name = document.createElement('strong')
            name.textContent = tool.name
            item.appendChild(name)

            const status = document.createElement('span')
            status.className = 'tool-status'
            status.textContent = tool.status === 'daily' ? 'using daily' : 'learning'
            item.appendChild(status)

            list.appendChild(item)
        }
    }
}
