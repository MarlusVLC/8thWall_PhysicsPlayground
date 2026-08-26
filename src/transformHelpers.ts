import type { World, Eid, Entity, math } from "@8thwall/ecs";
import { identifier } from './identitifier';
        
export function logWorldTransform (world: World, entity: Eid, entityName: string) {
    const transform = world.transform.getWorldTransform(entity);
    const matrixToString = transform.data().join(" | ");
    console.log(`World transform of ${entityName} = ${matrixToString}`);
}
// export function logWorldTransforms (world: World, ...entities: bigint[]) {
//     entities.forEach(entity => {
//         const name = identifier.has(world, entity) ? identifier.get(world, entity).name : entity.toString();
//         logWorldTransform(world, entity, name)
//     });
// }
// export function logWorldTransforms (world: World, ...entities: Entity[]){
//     entities.forEach(entity => {
//         const name = entity.has(identifier) ? entity.get(identifier).name : entity.eid.toString();
//         logWorldTransform(world, entity.eid, name)
//     })
// }
export function logWorldTransforms(world: World, ...entities: (bigint | Entity)[]){
    for (const e of entities){
        const entity = typeof e === 'bigint' ? world.getEntity(e) : e;
        const name = entity.has(identifier) ? entity.get(identifier).name : entity.eid.toString();
        logWorldTransform(world, entity.eid, name);
    }
}

export function logLocalTransform (world: World, entity: bigint, entityName: string)  {
        const transform = world.transform.getLocalTransform(entity);
        const matrixToString = transform.data().join(" | ");
        console.log(`Locas transform of ${entityName} = ${matrixToString}`);
    }
export function logLocalTransforms (world: World, ...entities: bigint[]){
    entities.forEach(entity => {
        const name = identifier.has(world, entity) ? identifier.get(world, entity).name : entity.toString();
        logLocalTransform(world, entity, name)
    });    
}

export function setParent (world: World, newChild: Eid, newParent: Eid, keepTransform: boolean = true){
    let ogTransform;
    if (keepTransform)
        ogTransform = world.transform.getWorldTransform(newChild);
    world.setParent(newChild, newParent);
    if (keepTransform)
        world.transform.setWorldTransform(newChild, ogTransform);
}

export function axisAngleDegrees(quat: math.Quat): math.Vec3 {
    const ogAxisAngle = quat.axisAngle();
    ogAxisAngle.setX(ogAxisAngle.x * (180/Math.PI));
    ogAxisAngle.setY(ogAxisAngle.y * (180/Math.PI));
    ogAxisAngle.setZ(ogAxisAngle.z * (180/Math.PI));
    return ogAxisAngle;
}
