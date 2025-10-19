import { ANIMATOR_STATE } from "./common_const";

export const RES_CHUNKS = {
    REQUIRED:'start_pack',
    ENTRY_LOC:'start_pack',
    CASTLE:'start_pack',
    TREES:'start_pack',
    TRAINING_ARENA:'intro_loc',
    HEROES:'heroes_models',
}
export const ZIP_PREFIX = 'resources';

export const MODELS_ID = {
    HERO_BASE:'init_hero',
    SOLDER:'solder',
    HEAVY_SOLDER:'heavy_solder',
}
export const RESOURCES_META = {
    [MODELS_ID.HERO_BASE]: {
        CHUNK:RES_CHUNKS.HEROES,
        PATH: 'Alien/Alien_Helmet.glb',
        ANIMATIONS: {
            [ANIMATOR_STATE.IDLE]   : 'Alien_Idle',
            [ANIMATOR_STATE.RUN]    : 'Alien_Run',
            [ANIMATOR_STATE.ATTACK] : 'Alien_SwordSlash',
            [ANIMATOR_STATE.HIT]    : 'Alien_Idle',
            [ANIMATOR_STATE.DIE]    : 'Alien_Death'
        }
    },
    [MODELS_ID.SOLDER]: {
        CHUNK:RES_CHUNKS.HEROES,
        PATH: 'robots/Velociraptor.glb',
        ANIMATIONS: {
            [ANIMATOR_STATE.IDLE]   : 'Velociraptor_Idle',
            [ANIMATOR_STATE.RUN]    : 'Velociraptor_Run',
            [ANIMATOR_STATE.ATTACK] : 'Velociraptor_Attack',
            [ANIMATOR_STATE.HIT]    : 'Velociraptor_Idle',
            [ANIMATOR_STATE.DIE]    : 'Velociraptor_Death'
        },
    },
    [MODELS_ID.HEAVY_SOLDER]: {
        CHUNK:RES_CHUNKS.HEROES,
        PATH: 'robots/Robot.glb',
        ANIMATIONS: {
            [ANIMATOR_STATE.IDLE]   : 'Robot_Idle',
            [ANIMATOR_STATE.RUN]    : 'Robot_Running',
            [ANIMATOR_STATE.ATTACK] : 'Robot_Punch',
            [ANIMATOR_STATE.HIT]    : 'Robot_Idle',
            [ANIMATOR_STATE.DIE]    : 'Robot_Death'
        }
    },
}