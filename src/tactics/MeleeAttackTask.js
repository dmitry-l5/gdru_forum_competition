import { Vector3 } from "@babylonjs/core";
import { BaseTask } from "../BaseTask";
import { Character } from "../Character";
import { ATTACK_TYPE, BEHAVIORS } from "../tuneup/common_const";

export function MeleeAttackTask(options){
    const { bot, target } = options;
    if(!bot.target || !(bot.target instanceof Character)) return;
    const task = Object.create(BaseTask);
    task.init(options);
    task.breakCondition = function(){
        if(BaseTask.breakCondition.call(task)){
            this.isCompleted = true;
            return true;
        }
        return !this.bot.seesTarget();
        // const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
        // const meleeDistance = this.bot.options?.[ATTACK_TYPE.MELEE]?.distance ?? 0;
        // return dist > meleeDistance;
    }
    task.update = function(deltaTime){
        if( this.bot.canMelee() && 
            (Vector3.Distance(this.bot.root.position, this.target.root.position) < this.bot.meleeAttackDistance)  
        ){
      
            this.bot.setBehavior(BEHAVIORS.MELEE);
        }else if(this.bot.hasPath()){
            this.bot.setBehavior(BEHAVIORS.FOLLOW_PATH);
        }else{
            this.bot.setBehavior(BEHAVIORS.IDLE);
        }
    }
    return task;
}