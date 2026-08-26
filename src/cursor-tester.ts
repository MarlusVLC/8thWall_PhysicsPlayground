// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.
import {MoverComponent} from './mover'

ecs.registerComponent({
  name: 'cursor-tester',
  schema: {
    entity1: ecs.eid,
    entity2: ecs.eid,
  },
  // schemaDefaults: {
  // },
  // data: {
  // },
  add: (world, component) => {
    const cursor1 = MoverComponent.get(world, component.schema.entity1);
    console.log(`MOVER for entity1 has (${cursor1.baseName} as name):`, cursor1);
    const cursor2 = MoverComponent.get(world, component.schema.entity2);
    console.log(`MOVER for entity2 has (${cursor2.baseName} as name):`, cursor2);

    console.log(`MOVER for entity1 has (${cursor1.baseName} as name):`, cursor1);
    console.log(cursor1 === cursor2 ? 'cursor1 and cursor2 are the same instance' : 'cursor1 and cursor2 are different instances');

  },
  // tick: (world, component) => {
  // },
  // remove: (world, component) => {
  // },
  // stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
  //   ecs.defineState('default').initial()
  // },
})
