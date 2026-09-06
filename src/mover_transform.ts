// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.
import * as transformHelper from './transformHelpers'

const MoverTransform = ecs.registerComponent({
  name: 'moverTransform',
  schema: {
    target: ecs.eid,
    translationSpeed: ecs.f32,
    targetRadius: ecs.f32,
    originRadius: ecs.f32,
    rotationSpeed: ecs.f32,
  },

  stateMachine: ({world, eid, entity, schemaAttribute, dataAttribute, defineState}) => {
    let originPos: ecs.math.Vec3;
    let currentTargetPos: ecs.math.Vec3;
    let currentStateID: string | {	name: string; };

    const ROTATION_EPSILON_DEGREES = 0.5;

    const followingState = defineState('default');
    const returningState = defineState('returning');
    const preparationState = defineState('preparation').initial();

    const targetReached = ecs.defineTrigger();
    const originReached = ecs.defineTrigger();
    const readyToFollow = ecs.defineTrigger();
    const readyToReturn = ecs.defineTrigger();

    const schema = schemaAttribute.get(eid);
    const target = world.getEntity(schema.target);
    const targetPosition = () => target.getWorldPosition();

    // Rebuilds a quaternion from its pitch/yaw/roll (X/Y/Z) euler angles with
    // pitch (X) forced to zero, so this rotation never carries any rotation
    // on the X axis, no matter what quat.lookAt / slerp produced.
    const withoutZRotation = (rotation: ecs.math.Quat): ecs.math.Quat => {
      const euler = rotation.pitchYawRollDegrees();
      euler.setZ(0);
      return ecs.math.quat.pitchYawRollDegrees(euler);
    };


    preparationState
    .onEnter(() => {
      switch (currentStateID){
        case followingState:
          currentTargetPos = originPos.clone();
          break;
        case returningState:
        default:
          currentTargetPos = targetPosition();
      }
    })
    .onTick(() => {
      const schema = schemaAttribute.get(eid);
      // World up (not the entity's own, possibly tilted, up vector) keeps the
      // look-at from leaning on the entity's current pitch; withoutXRotation
      // then strips out whatever pitch quat.lookAt still produced.
      const upVector = ecs.math.vec3.up();
      const targetRotation = withoutZRotation(
        ecs.math.quat.lookAt(entity.getWorldPosition(), currentTargetPos, upVector).setNormalize()
      );
      const currentRotation = entity.getWorldQuaternion();
      const angleRemaining = currentRotation.degreesTo(targetRotation);

      if (angleRemaining <= ROTATION_EPSILON_DEGREES) {
        entity.setWorldQuaternion(targetRotation);
        // The next state depends on which state we were in before entering
        // preparationState: coming from followingState means we just arrived
        // at the target and now face back towards the origin, so we're ready
        // to return; any other case (initial spawn, or coming back from
        // returningState) means we just faced the target and are ready to follow it.
        if (currentStateID === followingState) {
          readyToReturn.trigger();
        } else {
          readyToFollow.trigger();
        }
        return;
      }

      const maxDegreesThisTick = schema.rotationSpeed * (world.time.delta / 1000);
      const t = Math.min(1, maxDegreesThisTick / angleRemaining);
      entity.setWorldQuaternion(withoutZRotation(currentRotation.slerp(targetRotation, t)));
    })
    .onTrigger(readyToFollow, followingState)
    .onTrigger(readyToReturn, returningState);

    followingState
    .onEnter(() => {
      originPos = entity.getWorldPosition();
      currentStateID = followingState;
    })
    .onTick(() => {
      const targetPosition = target.getWorldPosition();
      const direction = targetPosition.minus(entity.getWorldPosition()).setNormalize();
      // console.log('Time delta = ', world.time.delta/1000);
      entity.translateWorld(direction.scale(schema.translationSpeed * (world.time.delta/1000)))
      // console.log('Charger position = ', entity.getWorldPosition())
      entity.lookAt(target);
      // if (entity.getWorldPosition().distanceTo(targetPosition) <= schema.targetRadius){
      if (transformHelper.sqrDistance(entity.getWorldPosition(), targetPosition) <= Math.pow(schema.targetRadius,2)){
        targetReached.trigger();
      }
    })
    .onTrigger(targetReached, preparationState);

    returningState
    .onEnter(() => {
      // console.log('TARGET REACHED!')
      currentStateID = returningState;
    })
    .onTick(() => {
      entity.lookAtWorld(originPos);
      const schema = schemaAttribute.get(eid);
      transformHelper.moveTowardsRuntime(world, schema.translationSpeed, entity, originPos)
      if (transformHelper.sqrDistance(entity.getWorldPosition(), originPos) <= Math.pow(schema.originRadius,2)){
        originReached.trigger();
      }
    })
    .onTrigger(originReached, preparationState);
  },
})
  

export { MoverTransform }
