import { RES_CHUNKS } from "./resource_const";

export const MAPS_ID = {
    START:'start_loc',
    INTRO: 'intro_loc'
}

export const MAPS_META = {
    [MAPS_ID.START]:{
        CHUNK: RES_CHUNKS.REQUIRED,
        PATH: 'Robot.glb',
        CHUNKS:[
            RES_CHUNKS.ENTRY_LOC,
            RES_CHUNKS.CASTLE,
            RES_CHUNKS.TREES,
        ]
    },
    [MAPS_ID.INTRO]:{
        CHUNK: RES_CHUNKS.TRAINING_ARENA,
        // PATH: 'models/intro_map.glb',
        NAVIGATION: 'intro_level/nav_grid.png',
        CHUNKS:[
            RES_CHUNKS.REQUIRED,
        ],
    }
}