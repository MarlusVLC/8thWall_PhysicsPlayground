import * as ecs from '@8thwall/ecs'

const identifier = ecs.registerComponent({
    name: 'identifier',
    schema: {
        name: ecs.string
    },
})

export {identifier}