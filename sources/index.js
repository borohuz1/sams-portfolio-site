import './threejs-override.js'
import { Game } from './Game/Game.js'
import { SiteContent } from './Game/SiteContent.js'
import consoleLog from './data/consoleLog.js'

if(import.meta.env.VITE_LOG)
    console.log(
        ...consoleLog
    )

// Fill the interface with the content from sources/data/site.js
new SiteContent()

if(import.meta.env.VITE_GAME_PUBLIC)
    window.game = new Game()
else
    new Game()