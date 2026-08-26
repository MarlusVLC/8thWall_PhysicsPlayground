import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
    name: 'general-tester',
    add: (world, component) => {
        console.log('general-tester component added to entity:', component.eid);
        // world.time.setTimeout(() => {
        //     world.deleteEntity(component.eid);
        // }, 5000); // 5 seconds
        const a = world.three.entityToObject.get(component.eid);
        
        console.log('general-tester component scene:', a);
    },
    // tick: (world, component) => {
    // },
    remove: (world, component) => {
        console.log('general-tester component removed from entity:', component.eid);
    },
})