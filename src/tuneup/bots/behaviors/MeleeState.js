import { ANIMATOR_STATE, PLAYGROUND_ACTIONS } from "../../common_const";
import { State } from "./State";
import { Vector3 } from "@babylonjs/core";

export function MeleeState(bot, animator) {
    State.call(this, bot, animator);
    this.name = 'Melee';
}

MeleeState.prototype = Object.create(State.prototype);
MeleeState.prototype.constructor = MeleeState;

MeleeState.prototype.enter = function() {
    this.animator.play(ANIMATOR_STATE.ATTACK, { loop: true, 
        onEndCallback:()=>{
            console.warn('           attack            accept             demage');
        },
        onLoopCallback:()=>{
            this.bot?.playgroundActionCallback( PLAYGROUND_ACTIONS.MELEE, {
                position:this.bot.root.position,
                direction:this.bot.root.getDirection(Vector3.Forward()),
                range:10,
                damage:10,
                excludedGroup:this.bot.group,
                attacker:this.bot,
            });
            console.warn('           attack            LOOP             demage');
        } }
    );
};

MeleeState.prototype.update = function(deltaTime) {

};

MeleeState.prototype.exit = function() {

};

