import { type World, type Eid, type Entity, math, eid, ColliderShape, ColliderType } from "@8thwall/ecs";
import { identifier } from './identitifier';
import { Object3D, Mesh, PerspectiveCamera } from "three";
        
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

export function sqrDistance(a: math.Vec3, b: math.Vec3): number {
    return Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)+Math.pow(b.z-a.z,2);
}

export function moveTowardsRuntime(world: World, speed: number, entity: Entity, targetPos: math.Vec3){
    const direction = (targetPos.minus(entity.getWorldPosition())).setNormalize();
    entity.translateWorld(direction.scale(speed*world.time.delta/1000));
}

export function isInOrthoCameraView(world: World, targetEid: Eid): boolean {
    const cameraEid = world.camera.getActiveEid();

    // Posição e rotação da câmera ativa
    const camPos = world.transform.getWorldPosition(cameraEid);
    const camRotation = world.transform.getWorldQuaternion(cameraEid);

    // Parâmetros de projeção (assume câmera perspectiva)
    const camObj = world.three.activeCamera as PerspectiveCamera;

    // Vetores locais da câmera (frente, direita, cima) há no espaço do mundo
    const camRotMat = math.mat4.r(camRotation);
    const camForward = camRotMat.timesVec(math.vec3.xyz(0, 0, -1));
    const camRight = camRotMat.timesVec(math.vec3.xyz(-1, 0, 0));
    const camUp = camRotMat.timesVec(math.vec3.xyz(0, 1, 0));

    // Vetor câmera -> objeto
    const targetPos = world.transform.getWorldPosition(targetEid);
    const toTarget = targetPos.minus(camPos);

    // Projeta em eixos locais da câmera
    const depth = -toTarget.dot(camForward); // "Profundidade" (distância à frente da câmera)
    const viewX = toTarget.dot(camRight); // Deslocamento horizontal
    const viewY = toTarget.dot(camUp); // Deslocamento vertical

    // Atrás da câmera ou muito longe (fora do near/fear) -> fora de vista
        // console.log(`DEPTH = ${depth} | NEAR = ${camObj.near} | FAR = ${camObj.far}`)

    if (depth < camObj.near || depth > camObj.far) return false;


    // Meia-altura/meia-largura do frustum nessa profundidade
    const halfHeight = depth * Math.tan((camObj.fov * Math.PI / 180) / 2)
    const halfWidth = halfHeight * camObj.aspect;
    

    return Math.abs(viewX) <= halfWidth && Math.abs(viewY) <= halfHeight;

}
