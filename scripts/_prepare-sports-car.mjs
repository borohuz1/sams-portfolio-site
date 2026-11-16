/**
 * Reshapes the downloaded Grab3D sports car to match the node names and
 * hierarchy the fork's vehicle code expects:
 *
 *   vehicle
 *     chassis
 *       bodyPainted   (originally sports-car_body)
 *       windows       (originally sports-car_windows)
 *       wheelContainer (template; cloned 4x at runtime by code)
 *         wheelCylinder (originally sports-car_wheel_fl)
 *         wheelPainted  (same wheel, for achievements paint swap)
 *
 * The three other wheels (fr / rl / rr) are removed because wheelContainer is
 * cloned four times by the visual vehicle code at runtime.
 *
 * Run with: node scripts/_prepare-sports-car.mjs
 */

import { NodeIO } from '@gltf-transform/core'

const input = 'resources/sports-car.glb'
const output = 'static/vehicle/default.glb'

const io = new NodeIO()
const doc = await io.read(input)
const root = doc.getRoot()
const scene = root.listScenes()[0]

const nodesByName = new Map()
for(const n of root.listNodes())
    nodesByName.set(n.getName(), n)

function get(name)
{
    const n = nodesByName.get(name)
    if(!n)
        throw new Error(`Missing node: ${name}`)
    return n
}

const bodyNode = get('sports-car_body')
const windowsNode = get('sports-car_windows')
const wheelFl = get('sports-car_wheel_fl')
const wheelFr = get('sports-car_wheel_fr')
const wheelRl = get('sports-car_wheel_rl')
const wheelRr = get('sports-car_wheel_rr')

// Build new wrapper structure
const vehicle = doc.createNode('vehicle')
const chassis = doc.createNode('chassis')
const wheelContainer = doc.createNode('wheelContainer')
const wheelPainted = doc.createNode('wheelPainted')

// Detach existing meshes from scene
scene.removeChild(bodyNode)
scene.removeChild(windowsNode)
scene.removeChild(wheelFl)
scene.removeChild(wheelFr)
scene.removeChild(wheelRl)
scene.removeChild(wheelRr)

// Rename + reparent
bodyNode.setName('bodyPainted')
chassis.addChild(bodyNode)

windowsNode.setName('windows')
chassis.addChild(windowsNode)

wheelFl.setName('wheelCylinder')
wheelContainer.addChild(wheelFl)

// wheelPainted shares the wheel mesh, slightly smaller, so changing its
// material (achievements reward) doesn't z-fight the tire
wheelPainted.setMesh(wheelFl.getMesh())
wheelPainted.setScale([ 0.98, 0.98, 0.98 ])
wheelContainer.addChild(wheelPainted)

chassis.addChild(wheelContainer)
vehicle.addChild(chassis)
// The new model's nose faces +Z, which happens to be reversed relative to
// the physics model's forward direction. Rotate the parent by 180° so
// pressing forward (W) moves the car toward the nose.
vehicle.setRotation([ 0, 1, 0, 0 ])
scene.addChild(vehicle)

// Delete extra wheel nodes (meshes will be pruned on save)
root.listNodes().forEach((n) => {
    if(n === bodyNode || n === windowsNode || n === wheelFl)
        return
    const nm = n.getName()
    if(nm === 'sports-car_wheel_fr' || nm === 'sports-car_wheel_rl' || nm === 'sports-car_wheel_rr')
        n.dispose()
})

await io.write(output, doc)

console.log(`Wrote ${output}`)
const written = await io.read(output)
written.getRoot().listNodes().forEach((n) => console.log('  node:', n.getName()))
