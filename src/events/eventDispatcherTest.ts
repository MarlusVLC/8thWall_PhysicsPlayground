import * as ecs from '@8thwall/ecs'
import { getName } from './../identitifier';
// import { eventHandlerTest } from './eventHandlerTest'

const eventDispatcherTest = ecs.registerComponent({
    name: 'Event Dispatcher',
    schema:{
        useGlobal: ecs.boolean,
        // @condition useGlobal=false
        handlerTarget: ecs.eid,
        damage: ecs.i32,
    },
    schemaDefaults:{
        damage: 10,
    },
    add: (world, component) => {
        const eventDispatchTimeout = world.time.setInterval(() => {
            const eventID = component.schema.useGlobal ? world.events.globalId : component.schema.handlerTarget;
            // console.log('Event dispatched from: ', getName(world, component.eid));
            world.events.dispatch(eventID, 'damaged', {damage: component.schema.damage})
        }, 2000)
    }
})

export {eventDispatcherTest}