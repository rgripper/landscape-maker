import { animate, init } from './box'

import('../pkg/index.js').then((module) => {

    init(module.process_iteration);
    animate();
})