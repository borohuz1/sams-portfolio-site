/**
 * Experiments shown in the lab area.
 *
 * These are the things I am trying out, not finished products. Statuses are
 * honest on purpose.
 *
 * Each entry needs:
 *   title     - name of the experiment
 *   url       - link opened when you click it
 *   image     - 960x540 PNG inside static/lab/images/
 *   imageMini - smaller 480x270 PNG shown on the shelf
 */

export default [
    {
        title: 'Drivable Portfolio',
        url: 'https://github.com/borohuz1/sams-portfolio-site',
        image: 'drivable-portfolio.png',
        imageMini: 'drivable-portfolio-mini.png',
        status: 'This site',
        description: 'Three.js, TSL shaders and Rapier physics in one island you drive around.'
    },
    {
        title: 'AI Video Tests',
        url: 'https://github.com/borohuz1',
        image: 'ai-video-tests.png',
        imageMini: 'ai-video-tests-mini.png',
        status: 'In progress',
        description: 'Testing AI video and image generation for ad concepts and social content.'
    },
    {
        title: 'Roblox Combat Sandbox',
        url: 'https://github.com/borohuz1',
        image: 'roblox-combat-sandbox.png',
        imageMini: 'roblox-combat-sandbox-mini.png',
        status: 'In development',
        description: 'Frame-exact 3-hit combo controller with server-authoritative damage.'
    },
    {
        title: 'CGI Ad Concepts',
        url: 'https://github.com/borohuz1',
        image: 'cgi-ad-concepts.png',
        imageMini: 'cgi-ad-concepts-mini.png',
        status: 'Sketching',
        description: 'Blender and 3ds Max mockups for advertising and product concepts.'
    },
    {
        title: 'Offline Voice AI',
        url: 'https://github.com/borohuz1',
        image: 'offline-voice-ai.png',
        imageMini: 'offline-voice-ai-mini.png',
        status: 'Working',
        description: 'Whisper.cpp transcription and Windows SAPI speech, running fully offline.'
    }
]

