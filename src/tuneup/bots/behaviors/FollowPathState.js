import { ANIMATOR_STATE } from "../../common_const";
import { State } from "./State";

export function FollowPathState(bot, animator){
    State.call(this, bot, animator);


}

FollowPathState.prototype = Object.create(State.prototype);
FollowPathState.prototype.constructor = FollowPathState;

FollowPathState.prototype.prepare = function(){
    this.animator.play(ANIMATOR_STATE.RUN, {loop: true});
}
FollowPathState.prototype.update = function(deltaTime){
    this.bot.followPathBehavior(deltaTime);
}
FollowPathState.prototype.exit = function() {
    this.animator.play(ANIMATOR_STATE.IDLE, {loop: true});
};