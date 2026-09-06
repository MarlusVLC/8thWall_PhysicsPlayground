import * as ecs from '@8thwall/ecs'
import * as transformHelper from './transformHelpers'
import {addCleanup, doCleanup} from './events/eventCleaner'

    const lerp = (alpha: number, min: number, max: number) => {
        return min + (max - min) * alpha;
    }

const createTouchStartHandler = (world: ecs.World, eid: ecs.Eid, schemaAttribute,  ) => (e) => {
    if (transformHelper.isInOrthoCameraView(world, eid) === false) return;

        //   const moveInput = event.data.position as ecs.math.Vec2;
        const moveInput = ecs.math.vec2.from(e.data.position);
        //   console.log('SCREEN_TOUCH_START position:', moveInput);
        moveInput.setX(lerp(moveInput.x, -1, 1)).setY(lerp(moveInput.y, 1, -1));

        // 1. Pega a câmera ativa e a rotação dela no mundo
        const cameraEid = world.camera.getActiveEid();
        const camRotation = world.transform.getWorldQuaternion(cameraEid);

        // 2. Monta a matriz de rotação da câmera e extrai os vetores locais
        //    "direita" (eixo X) e "cima" (eixo Y) dela, já no espaço do mundo
        const camRotMat = ecs.math.mat4.r(camRotation);
        const camRight = camRotMat.timesVec(ecs.math.vec3.xyz(1,0,0))
        const camUp = camRotMat.timesVec(ecs.math.vec3.xyz(0,1,0))

        // 3. x da tela -> direita/esquerda da câmera | y da tela -> cima/baixo da câmera
        const {moveRate} = schemaAttribute.get(eid);
        const moveVector = camRight.scale(-moveInput.x * moveRate)
            .setPlus(camUp.setScale(moveInput.y * moveRate));

        // console.log('LERPED INPUT = ', moveInput)
        // console.log('MOVE VECTOR = ', moveVector)
        
        world.getEntity(eid).translateWorld(moveVector);
}

ecs.registerComponent({
    name: 'Stateless Touch Mover',
    schema:{
        moveRate: ecs.f32,
    },
    add: (world, component) => {
        const touchStartHandler = createTouchStartHandler(world, component.eid, component.schemaAttribute);

        world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, touchStartHandler);
        const cleanup = () => {
            world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, touchStartHandler);
        }
        addCleanup(component,cleanup);
    },
    remove: (world, component) => {
        doCleanup(component);
    }
})