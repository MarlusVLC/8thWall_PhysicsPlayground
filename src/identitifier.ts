import * as ecs from '@8thwall/ecs'

const identifier = ecs.registerComponent({
    name: 'identifier',
    schema: {
        name: ecs.string
    },
})

// export function getName(world: ecs.World, eid: ecs.Eid): string{
//     return identifier.has(world, eid)
//         ? identifier.get(world, eid).name
//         : eid.toString();
// }

export const getName = (world: ecs.World, eid: ecs.Eid): string => {
    return identifier.has(world, eid)
        ? identifier.get(world, eid).name
        : eid.toString();
}

export {identifier}