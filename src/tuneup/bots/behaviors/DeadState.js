import { ANIMATOR_STATE, PLAYGROUND_ACTIONS } from "../../common_const";
import { State } from "./State";
import { Vector3 } from "@babylonjs/core";

export function ImmortalDeadState(bot, animator) {
    State.call(this, bot, animator);
    this.name = 'Melee';
}

ImmortalDeadState.prototype = Object.create(State.prototype);
ImmortalDeadState.prototype.constructor = ImmortalDeadState;

ImmortalDeadState.prototype.enter = function() {
    this.animator.play(ANIMATOR_STATE.DIE, { loop: false, 
        onEndCallback:()=>{
            console.warn('Character die. Animation ended!!! -------------------------------');   
        }
    });
};

ImmortalDeadState.prototype.update = function(deltaTime) {

};

ImmortalDeadState.prototype.exit = async function() {
    await State.call(this);
    return true;
};

