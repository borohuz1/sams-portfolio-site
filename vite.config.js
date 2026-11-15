import 'dotenv/config'
import wasm from 'vite-plugin-wasm'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    envDir: '../',  // Directory where the env file is located
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Public path (what's after the domain)
    server:
    {
        // https: true,
        host: true, // Open to local network and display URL
        open: false // Do NOT open a browser automatically. This world renders at full
                    // framerate with WebGPU and will pin a CPU and a GPU. Open the
                    // printed URL yourself when you actually want to look at it.
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
    plugins:
    [
        wasm(),
        // NOTE: no `restart` watcher on ../static/** on purpose. Static files are
        // served straight from disk, so a change never needs a server restart.
        // Restarting forced a full page reload, which re-downloaded every sound
        // and every texture each time anything moved.
        nodePolyfills(),
        // basicSsl()
    ]
}
