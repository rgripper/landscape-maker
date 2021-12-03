import { animate, init } from './box.js'

import('../pkg/index.js').then((module) => {
    init();
    animate();
    module.process_iteration()
})