// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'age-counter',
  // schema: {
  // },
  // schemaDefaults: {
  // },
  data: {
    age: ecs.f32,
    interval: ecs.f32,
  },
  add: (world, component) => {
    const {eid, dataAttribute} = component;
    dataAttribute.mutate(eid, (data) => {
      data.age = 1;  // Initialize age to 1 when the component is added
      return true;
    })
    const interval = world.time.setInterval(() => {
      // This is safe because we're re-acquiring a cursor at the time we need it,
      // instead of using a stale cursor from before
      const dataCursor = dataAttribute.cursor(eid);

      dataCursor.age += 1;
      console.log(`Age for entity ${component.eid} is now:`, dataCursor.age);
    }, 1000)

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
