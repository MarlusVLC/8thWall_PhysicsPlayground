import * as ecs from '@8thwall/ecs'
import { getName } from './../identitifier';
import { addManagedListener, addCleanup, doCleanup } from './eventCleaner';

const createDamageHandler = (world: ecs.World, dataAttribute, schemaAttribute, eid: ecs.Eid) => (e) => {
    console.log('DAMAGE LISTENER = ', e);
    // const dispatcherEid = (e.target as ecs.Eid);;
    // const dispatcherName = getName(world, dispatcherEid);
    // const listenerEid = (e.currentTarget as ecs.Eid);
    // const listenerName = getName(world, eid);
    // const eventName = e.name;
    // const eventData = e.data.s; 

    const dataCursor = dataAttribute.cursor(eid);
    dataCursor.healthPoints -= e.data.damage;

    // console.log(`listened on ${listenerName} | event NAME: ${eventName} | event DATA: ${eventData}`)
    // console.log(`${listenerName}'s health has been updated to ${dataCursor.healthPoints}`)
    ecs.Material.mutate(world, eid, (cursor) => {
        cursor.r = (1-(dataCursor.healthPoints/100))*255; // 1 - 0.9 = 0.1
        cursor.g = (dataCursor.healthPoints/100)*255;
        return false;
    });
    if (dataCursor.healthPoints <= 0){
        world.getEntity(eid).delete();
    }
}

const eventHandlerTest = ecs.registerComponent({
    name: 'Event Handler',
    schema: {
        isPoisoned: ecs.boolean,
        listenToDamageOnGlobalChannel: ecs.boolean,
    },
    data: {
        healthPoints: ecs.f32,
        staminaPoints: ecs.f32,
    },
    add: (world, component) => {
        component.dataAttribute.mutate(component.eid, (cursor) => {
            cursor.healthPoints = 100;
            cursor.staminaPoints = 100;
        })

        const damagedHandler = createDamageHandler(world, component.dataAttribute, component.schemaAttribute, component.eid);
        const eventChannel = component.schema.listenToDamageOnGlobalChannel ? world.events.globalId : component.eid;
        world.events.addListener(eventChannel, 'damaged', damagedHandler)
        const cleanup = () => {
            world.events.removeListener(eventChannel, 'damaged', damagedHandler);
        };

        addCleanup(component, cleanup);        
    },
    remove: (world, component) => {
        doCleanup(component);
    }
})

export { eventHandlerTest }