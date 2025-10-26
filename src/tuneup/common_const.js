export const LANGS = {
    UNKNOWN: null,
    RU: 'ru',
    EN: 'en',
}

export const CHAR_GROUPS = {
    BOT: 'bot',
}

export const ATTACK_TYPE = {
    NONE:'none',
    MELEE:'meleeAttack',
    RANGED:'rangedAttack',
}
export const PLAYGROUND_ACTIONS = {
    CREATE_PROJECTILE: 'create_projectile',
    MELEE:'melee_attack',
}
export const PROJECTILE_TYPE = {
    DEFAULT: 'default',
    LASER: 'laser',
    FIREBALL: 'fireball'
}

export const CHAR_STATUS = {
    AGGRESSIVE: 'aggressive',
    PASSIVE: 'passive',
    DEFENSIVE: 'defensive',
}

export const TAGS = {
    NAV_MESH_FLOOR: 'nav_mesh_floor',
    POINT_PREFIX: 'point_',
    LEFT:'left',
    RIGHT:'right',
}

export const ANIMATOR_STATE = {
    IDLE:'idle',
    IDLE_PISTOL:'idle_pistol',
    RUN:'run',
    RUN_PISTOL:'run_pistol',
    WALK:'walk',
    WALK_PISTOL:'walk_pistol',
    ATTACK:'attack',
    ATTACK_PUNCH:'attack_punch',
    ATTACK_PUNCH_LEFT:'attack_punch_left',
    ATTACK_PUNCH_RIGHT:'attack_punch_right',
    HIT:'hit',
    DIE:'die',
    TALK:'talk',
}
export const ANIMATOR_CALLBACK_NAME = {
    MELEE_ATTACK_END: 'meleeAttackEndCallback',
    RANGED_ATTACK_END: 'rangedAttackEndCallback',
}

export const ANIMATOR_STATE_META = {
    [ANIMATOR_STATE.IDLE]               :{ loop: true,  callback:null},
    [ANIMATOR_STATE.IDLE_PISTOL]        :{ loop: true,  callback:null},
    [ANIMATOR_STATE.RUN]                :{ loop: true,  callback:null},
    [ANIMATOR_STATE.RUN_PISTOL]         :{ loop: true,  callback:null},
    [ANIMATOR_STATE.WALK]               :{ loop: true,  callback:null},
    [ANIMATOR_STATE.WALK_PISTOL]        :{ loop: true,  callback:null},
    [ANIMATOR_STATE.ATTACK]             :{ loop: false, callback:ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END},
    [ANIMATOR_STATE.ATTACK_PUNCH]       :{ loop: false, callback:ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END},
    [ANIMATOR_STATE.ATTACK_PUNCH_LEFT]  :{ loop: false, callback:ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END},
    [ANIMATOR_STATE.ATTACK_PUNCH_RIGHT] :{ loop: false, callback:ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END},
    [ANIMATOR_STATE.HIT]                :{ loop: false, callback:true},
    [ANIMATOR_STATE.DIE]                :{ loop: false, callback:true},
    [ANIMATOR_STATE.TALK]               :{ loop: true,  callback:false},
}

export const BEHAVIORS = {
    IDLE: 'idle',
    PATROL: 'patrol',
    FOLLOW_PATH: 'follow_the_path',
    COMBAT:'combat',
    MELEE: 'melee',
}