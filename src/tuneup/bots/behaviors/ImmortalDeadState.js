import { ANIMATOR_STATE, PLAYGROUND_ACTIONS } from "../../common_const";
import { State } from "./State";
import { Vector3 } from "@babylonjs/core";

export function DeadState(bot, animator) {
    State.call(this, bot, animator);
    this.name = 'Melee';
}

DeadState.prototype = Object.create(State.prototype);
DeadState.prototype.constructor = DeadState;

DeadState.prototype.enter = function() {
    this.animator.play(ANIMATOR_STATE.DIE, { loop: false, 
        onEndCallback:()=>{
            console.warn('Character die. Animation ended!!! -------------------------------');   
        }
    });
};

DeadState.prototype.update = function(deltaTime) {

};

DeadState.prototype.exit = async function() {
    await State.call(this);
    return true;
};