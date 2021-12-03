import { animate, init } from './box'

import('../pkg/index.js').then((module) => {
    init();
    animate();
    module.process_iteration()
})