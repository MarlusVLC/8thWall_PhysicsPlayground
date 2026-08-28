import * as ecs from '@8thwall/ecs'
import * as transformHelpers from './transformHelpers'
import { identifier } from './identitifier';


ecs.registerComponent({
    name: 'entity-tester',
    schema: {
        entityA: ecs.eid,
        parentA: ecs.eid,
        entityC: ecs.eid,
    },
    add: (world, component) => {
        const entityA = component.schemaAttribute.cursor(component.eid).entityA;
        const parentA = component.schemaAttribute.cursor(component.eid).parentA;
        const entityC = component.schemaAttribute.cursor(component.eid).entityC;

        // transformHelpers.setParent(world, entityA, parentA);
        // console.log(`${entityA} is now a child of ${world.getParent(entityA)} who is a child of ${world.getParent(world.getParent(entityA))}`);
        
        // if (entityC !== 0n) {
        //     transformHelpers.setParent(world, entityC, parentA); 
        // }

        // const children = world.getChildren(parentA);
        // for (const child of children) {
        //     console.log(`Child of entityB: ${child}`);
        // }

        // TRANSFORM TEST
            // const transformA = ecs.math.mat4.i();
            // const transformData = transformA.data();
            // for (let i = 0; i < transformData.length; i++) {
            //     matrixToString += transformData[i]
            //     if (i < transformData.length - 1) {
            //         matrixToString += " | ";
            //     }
            // }
            // console.log(`Identity transform = ${matrixToString}`);

        // world.transform.lookAtLocal(entityA, world.transform.getLocalPosition(parentA));
        // console.log(world.transform.getWorldPosition(entityA))

        const pos = ecs.Position.get(world, entityA)
        const posVec3 = ecs.math.vec3.from(pos);
        // const posVec3 = ecs.math.vec3.one();
        // const posVec3 = ecs.math.vec3.up();
        console.log('posVec3 = ', posVec3)
        // let posVec32 = posVec3.clone();
        // posVec32.makeScale(3);
        // console.log('posVec32 = ', posVec32)
        // console.log('posVec3 = ', posVec3)


        // const axis = ecs.math.vec3.xyz(0,1,0)
        // const angleDegrees = -90 // π/180 
        // const angleRadians = angleDegrees * (Math.PI / 180);
        // console.log('angle radians = ', angleRadians)

        // const targetRot = ecs.math.quat.axisAngle(axis.scale(angleRadians));
        // const targetRot = ecs.math.quat.pitchYawRollDegrees(ecs.math.vec3.xyz(0,90,0))
        const targetRot = ecs.math.quat.pitchYawRollDegrees({x:0,y:90,z:0})
        // const targetRot = ecs.math.quat.pitchYawRollRadians({x:0, y: Math.PI/4, z:0})
        // const targetRot = ecs.math.quat.yRadians(Math.PI/2)
        // const quarterQuat = Math.sqrt(2)/2;
        // const targetRot = {x:0,y:quarterQuat,z:0,w:quarterQuat}
        console.log('target rot = ', targetRot)
        ecs.Quaternion.set(world, entityA, targetRot)

        const rot = ecs.Quaternion.get(world, entityA)
        const quat = ecs.math.quat.from(rot)
        console.log('quat = ', quat)
        console.log('axisAngles = ', quat.axisAngle())
        console.log('axisAngles in degrees = ', transformHelpers.axisAngleDegrees(quat))
        console.log('inverse quat = ', quat.conjugate())
        console.log('angle between target and inverse = ', quat.degreesTo(quat.conjugate()))
        const comparisonRot = ecs.math.quat.pitchYawRollDegrees({x: 0, y:-90, z:0})
        console.log('angle between targetRot and comparisonRot = ', quat.degreesTo(comparisonRot))
        console.log('delta = ', targetRot.delta(comparisonRot))
        console.log('inv = ', targetRot.inv())
        console.log('half slerp = ', transformHelpers.axisAngleDegrees(quat.slerp(quat.conjugate(), 0.5)))
    

        transformHelpers.logWorldTransforms(world, entityA, parentA, entityC);
        transformHelpers.logLocalTransforms(world, entityA, parentA, entityC);

        const origin = ecs.math.vec3.from(ecs.Position.get(world, parentA))
        const dirToTarget = (posVec3.minus(origin)).normalize();
        console.log('dirToTarget = ', dirToTarget)
        const raycastTimeout = world.time.setTimeout(() => {
            const intersect = world.raycast(origin, dirToTarget)
            console.log('targets hit = ', intersect.length)

            intersect.forEach(intersection => {
                const entity = world.getEntity(intersection.eid);
                
                console.log('intersection entity = ', entity.has(identifier) ? entity.get(identifier).name : intersection.eid)
                console.log('entity position = ', entity.getWorldPosition());
                console.log('intersection point = ', intersection.point);
                console.log('intersection distance = ', intersection.distance)
                const a = intersection.threeData;
                console.log('threedata = ', a);
                entity.delete;
            })
        }, 5000)

    },
    // stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {

    // }
})