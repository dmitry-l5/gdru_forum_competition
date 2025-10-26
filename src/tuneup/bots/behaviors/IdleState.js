import { ANIMATOR_STATE } from "../../common_const";
import { State } from "./State";

export function IdleState(bot, animator){
    State.call(this, bot, animator);


}

IdleState.prototype = Object.create(State.prototype);
IdleState.prototype.constructor = IdleState;

IdleState.prototype.prepareAndStart = function(){
    this.animator.play(ANIMATOR_STATE.IDLE, { loop: true });
}
IdleState.prototype.update = function(){
    // nothink to do
}