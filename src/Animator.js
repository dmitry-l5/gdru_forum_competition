import { AnimationGroup } from "@babylonjs/core";
import { ANIMATOR_STATE } from "./tuneup/common_const";

// const DEFAULT_ANIMATION_NAMES = {
//     idle: 'Idle',
//     run: 'Run',
//     attack: 'Attack',
//     hit: 'Hit',
//     die: 'Die',
//     talk: 'Talk',
// };

export function Animator(animationConfig) {
    this.animationGroups = {};
    this.currentAnimation = null;
    this.animationConfig = animationConfig;
    this.currentState = null;
    this.onLoopObserver = null;
}

Animator.prototype.init = function(description, animationGroups ) {
    for(let [key, value] of Object.entries(description)){
        this.animationGroups[key] = animationGroups.find(item=> item.name === value)
    }
    // this.play(ANIMATOR_STATE.IDLE);
};

Animator.prototype.play = function(stateName, options = {}) {
    const {loop = false, onEndCallback = null, onLoopCallback = null} = options;
    const animation = this.animationGroups[stateName];
    if (!animation) {
        return;
    }
    if (this.currentAnimation === animation) {
        return;
    }
    this.stop();

    if(onEndCallback){
        animation.onAnimationEndObservable.addOnce(()=>{
            onEndCallback();
        });
    }
    if (onLoopCallback) {
        this.onLoopObserver = animation.onAnimationGroupLoopObservable.add(() => {
            onLoopCallback();
        });
    }
    animation.start(loop, 1.0);
    this.currentState = stateName;
    this.currentAnimation = animation;
    return this.currentState;
};

Animator.prototype.stop = function() {
    if (this.currentAnimation) {
        this.currentAnimation.stop();
        if (this.onLoopObserver) {
            this.currentAnimation.onAnimationGroupLoopObservable.remove(this.onLoopObserver);
            this.onLoopObserver = null;
        }
        this.currentAnimation = null;
    }
};