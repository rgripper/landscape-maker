extern crate wasm_bindgen;

use rand::prelude::*;
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
    fn add_box_layer(this: &RenderingProvider, id: i32, box_layer: BoxLayer);
}

#[wasm_bindgen]
pub struct BoxLayer {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[wasm_bindgen]
pub fn process_iteration(rendering_provider: &RenderingProvider) {
    let mut rng = rand::thread_rng();
    let box_layers = (0..2000).map(|id| {
        (
            id,
            BoxLayer {
                x: rng.gen_range(-2500.0..2500.0),
                y: rng.gen_range(-1500.0..1500.0),
                z: rng.gen_range(-2000.0..2000.0),
            },
        )
    });
//https://towardsdatascience.com/geotiff-coordinate-querying-with-javascript-5e6caaaf88cf


    for (id, box_layer) in box_layers {
        rendering_provider.add_box_layer(id, box_layer);
    }
}
