// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'age-counter-incorrect',
  // schema: {
  // },
  // schemaDefaults: {
  // },
  data: {
    age: ecs.f32,
    interval: ecs.f32,
  },
  add: (world, component) => {
    component.data.age = 1;  // Initialize age to 1 when the component is added
    const interval = world.time.setInterval(() => {
      // This is not safe because we're accessing data after some amount of time
      // has passed, it's not guaranteed to still be valid.
      component.data.age += 1;
      console.log(`Age for entity ${component.eid} is now:`, component.data.age);
    }, 1000)

    // This is safe because we're assigning to data within the add function
    component.data.interval = interval;
  },
  tick: (world, component) => {
    console.log('I am', component.data.age, 'seconds old')
  },
  remove: (world, component) => {
    world.time.clearTimeout(component.dataAttribute.cursor(component.eid).interval);
    console.log('Age counter removed for entity', component.eid);
  },
  // stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
  //   ecs.defineState('default').initial()
  // },
})
