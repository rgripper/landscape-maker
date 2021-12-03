extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

// Definitions of the functionality available in JS, which wasm-bindgen will
// generate shims for today (and eventually these should be near-0 cost!)
//
// These definitions need to be hand-written today but the current vision is
// that we'll use WebIDL to generate this `extern` block into a crate which you
// can link and import. There's a tracking issue for this at
// https://github.com/rustwasm/wasm-bindgen/issues/42
//
// In the meantime these are written out by hand and correspond to the names and
// signatures documented on MDN, for example
#[wasm_bindgen]
extern "C" {
    pub type RenderingProvider;
    #[wasm_bindgen(method)] // , js_name = update_box_layer
    fn update_box_layer(this: &RenderingProvider, box_layer: BoxLayer);
}

#[wasm_bindgen]
pub struct BoxLayer {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[wasm_bindgen]
pub fn process_iteration(rendering_provider: &RenderingProvider) {
    let box_layers = vec![
        BoxLayer {
            x: 1.0,
            y: 2.0,
            z: 3.0,
        },
        BoxLayer {
            x: 2.0,
            y: 3.0,
            z: 4.0,
        },
    ];

    for box_layer in box_layers {
        rendering_provider.update_box_layer(box_layer)
    }
}
