import * as ecs from '@8thwall/ecs'
import * as transformHelper from './transformHelpers'

ecs.registerComponent({
    name: 'Touch Mover',
    schema:{
        moveRate: ecs.f32,
    },

    stateMachine: ({world, eid, entity, defineState, schemaAttribute}) => {
        const movingState = defineState('moving').initial();

        const lerp = (alpha: number, min: number, max: number) => {
            return min + (max - min) * alpha;
        }

        const handleTouchStart = (event) => {
            if (transformHelper.isInOrthoCameraView(world, eid) === false) return;

            //   const moveInput = event.data.position as ecs.math.Vec2;
            const moveInput = ecs.math.vec2.from(event.data.position);
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
            
            entity.translateWorld(moveVector);
        }

        movingState.listen(world.events.globalId, ecs.input.SCREEN_TOUCH_START, handleTouchStart);
    }
})