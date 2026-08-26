// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const MoverComponent = ecs.registerComponent({
  name: 'mover',
  schema: {
    // @label Target entity to follow
    target: ecs.eid,
    // @condition target=null
    moveRadius: ecs.f32,
    // @group start targetPoint:vector3
    // @group condition target=null
    x: ecs.f32, y: ecs.f32, z: ecs.f32,
    // @group end
    baseSpeed: ecs.f32,
    // @min 0
    // @max 5  
    speedLevel: ecs.i32,
    // @asset
    baseName: ecs.string,
    isChangeling: ecs.boolean,
    // @group start closeColor:color
    // @group condition isChangeling=true
    r: ecs.f32, g: ecs.f32, b: ecs.f32,
    // @group end
    easeIn: ecs.boolean,
    easeOut: ecs.boolean,
    // @condition easeIn=true|easeOut=true
    // @enum Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Linear
    easingFuction: ecs.string,
  },

  schemaDefaults: {
    baseSpeed: 3.14,
    speedLevel: 1,
    baseName: 'SampleBox',
    isChangeling: true
  },

  data: {
    boostSpeed: ecs.f32
  },
  add: (world, component) => {
    console.log('mover component added to entity', component.eid);
    component.data.boostSpeed = 9;
  },
  // tick: (world, component) => {
  // },
  remove: (world, component) => {
    console.log('mover component removed from entity', component.eid);
  },
  // stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
  //   ecs.defineState('default').initial()
  // },
})

export { MoverComponent }