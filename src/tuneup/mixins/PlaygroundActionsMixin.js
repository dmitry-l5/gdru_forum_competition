import { PLAYGROUND_ACTIONS } from "../common_const";

export const PlaygroundActionsMixin = {};

PlaygroundActionsMixin.initMixin = function() {
    this.actionsCallbacks = {
        [PLAYGROUND_ACTIONS.MELEE]: this.handleMeleeAttack,
    };
};

PlaygroundActionsMixin.handlePlaygroundAction = function(action_const, options) {
    const handler = this.actionsCallbacks[action_const];
    if (handler) {
        handler.call(this, options);
    } else {
        console.warn(`PlaygroundActionsMixin: Неизвестное действие: ${action_const}`);
    }
};

PlaygroundActionsMixin.handleMeleeAttack = function(options) {
    const { position, direction, shape, range, angle, excludedTarget, damage } = options;

    console.warn('THIS IS MELEE ATTACK!');
    const targetsInArea = this.findTargetsInArea({ 
        position, 
        direction, 
        shape, 
        range, 
        angle,
        excludedTarget
    });

    for (const target of targetsInArea) {
        target.takeDamage(damage, excludedTarget);
    }
};