// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const MoverTransform = ecs.registerComponent({
  name: 'moverTransform',
  schema: {
    target: ecs.eid,
    translationSpeed: ecs.f32,
  },

  schemaDefaults: {

  },

  data: {
    
  },
  add: (world, component) => {

  },
  // tick: (world, component) => {
  // },
  remove: (world, component) => {
    
  },
  stateMachine: ({world, eid, entity, schemaAttribute, dataAttribute, defineState}) => {
    const followingState = defineState('default').initial();
    // COMPORTAMENTO DE RETORNO
    // GIT COMMIT

    followingState.onEnter(() => {

    })
    .onTick(() => {
      const schema = schemaAttribute.get(eid);
      const target = world.getEntity(schema.target);
      const targetPosition = target.getWorldPosition();
      const direction = targetPosition.minus(entity.getWorldPosition()).setNormalize();
      // console.log('Time delta = ', world.time.delta/1000);
      entity.translateWorld(direction.scale(schema.translationSpeed * (world.time.delta/1000)))
      // console.log('Charger position = ', entity.getWorldPosition())
      entity.lookAt(target);
    })
  },
})
  

export { MoverTransform }