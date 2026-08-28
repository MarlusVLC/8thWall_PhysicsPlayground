// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'sm-tester',
  schema: {
    name: ecs.string,
    // @enum backward, forward, jump, left, modify, right
    inputAction: ecs.string,
  },
  // schemaDefaults: {
  // },
  // data: {
  // },
  // add: (world, component) => {
  // },
  // tick: (world, component) => {
  // },
  // remove: (world, component) => {
  // },
  stateMachine: ({world, eid, entity, defineState, defineStateGroup, schemaAttribute, dataAttribute}) => {
    const defaultState = defineState('default');
    const otherState = defineState('otherState');
    const triggeredState = defineState('triggeredState');

    const nonInitialStates = defineStateGroup([otherState, triggeredState]);

    const trigger = ecs.defineTrigger();

    // const handleTouchStart = (event: ecs.ScreenTouchStartEvent) => {
    //   console.log('SCREEN_TOUCH_START position:', event.position);
    //   console.log('SCREEN_TOUCH_START world position:', event.worldPosition);
    // }

    
    const handleTouchStart = (event) => {
      console.log('SCREEN_TOUCH_START position:', event.data.position);
      console.log('SCREEN_TOUCH_START world position:', event.data.worldPosition);
    }

    defaultState
      .initial()
      .onEnter(() => {
        console.log('Entered default state for entity:', schemaAttribute.get(eid).name);
      })
      // .onTick(() => {
      //   console.log('Ticking default state for entity:', schemaAttribute.get(eid).name);
      // })
      .onExit(() => {
        console.log('Exiting default state for entity:', schemaAttribute.get(eid).name);
      })
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'otherState', {
        target: world.events.globalId,
        where: (event) => {
          handleTouchStart(event);
          return event.data.position.y < 0;
        }
      })


      otherState
      .onEnter(() => {
        console.log('Entered otherState for entity:', schemaAttribute.get(eid).name);
      })
      .onTick(() => {
        // console.log('Ticking otherState for entity:', schemaAttribute.get(eid).name);
        const inputAction = schemaAttribute.get(eid).inputAction;
        if (world.input.getAction(inputAction)) {
          console.log(inputAction.toUpperCase(), ' pressed, triggering transition to triggeredState');
          trigger.trigger();
        }
      })
      .onExit(() => {
        console.log('Exiting otherState for entity:', schemaAttribute.get(eid).name);
      })
      .wait(20000, 'default')  // Wait for 20 seconds before transitioning back to 'default'
      .onTrigger(trigger, 'triggeredState')



      triggeredState
      .onEnter(() => {
        console.log('Entered triggeredState for entity:', schemaAttribute.get(eid).name);
      })
      // .onTick(() => {
      //   console.log('Ticking triggeredState for entity:', schemaAttribute.get(eid).name);
      // })
      .onExit(() => {
        console.log('Exiting triggeredState for entity:', schemaAttribute.get(eid).name);
      })
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_START, handleTouchStart)
      .wait(20000, 'default')  // Wait for 20 seconds before transitioning back to 'default'



      nonInitialStates.onEnter(() => {
        console.log('Entered a non-initial state for entity:', schemaAttribute.get(eid).name);
      })
      // .onTick(() => {
      //   console.log('Ticking a non-initial state for entity:', schemaAttribute.get(eid).name);
      // })
      .onExit(() => {
        console.log('Exiting a non-initial state for entity:', schemaAttribute.get(eid).name);
      })
  }
})
