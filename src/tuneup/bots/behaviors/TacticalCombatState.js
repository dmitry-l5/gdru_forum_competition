// src/tuneup/bots/behaviors/TacticalCombatState.js

import { ANIMATOR_STATE } from "../../common_const";
import { State } from "./State";
import { Vector3 } from "@babylonjs/core";

export function TacticalCombatState(bot, animator) {
    State.call(this, bot, animator);
    this.name = 'Combat';
    this.currentTask = null;
    this.currentActionIndex = 0;
}

TacticalCombatState.prototype = Object.create(State.prototype);
TacticalCombatState.prototype.constructor = TacticalCombatState;

TacticalCombatState.prototype.setTask = function(task) {
    debugger;
    this.currentTask = task;
    this.currentActionIndex = 0;
};

TacticalCombatState.prototype.enter = function() {
    this.animator.play(ANIMATOR_STATE.IDLE, { loop: true });
};

TacticalCombatState.prototype.update = function(deltaTime) {
    if (!this.currentTask) {
        return;
    }

    if (!this.currentTask.condition()) {
        this.currentTask = null;
        this.currentActionIndex = 0;
        return;
    }

    const currentAction = this.currentTask.sequence[this.currentActionIndex];

    if (currentAction) {
        debugger;
        const targetPosition = this.bot.target.root.position;
        this.bot[currentAction.action](targetPosition, deltaTime);
        this.currentActionIndex++;
        if (this.currentActionIndex >= this.currentTask.sequence.length) {
            this.currentTask = null;
            this.currentActionIndex = 0;
        }
    }
};

TacticalCombatState.prototype.exit = function() {
    this.currentTask = null;
    this.currentActionIndex = 0;
};

