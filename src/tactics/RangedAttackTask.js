import { BaseTask } from "../BaseTask";
import { ATTACK_TYPE, BEHAVIORS } from "../tuneup/common_const";

export function RangedAttackTask(options){
    const task = Object.create(BaseTask);
    task.init(options);
    task.breakCondition = ()=>{
        if(BaseTask.breakCondition.call(this)){
            this.isCompleted = true;
            return true;
        }
        const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
        const meleeDistance = this.bot.options?.[ATTACK_TYPE.MELEE]?.distance ?? 0;
        return dist > meleeDistance;
    }
    task.update = (deltaTime)=>{
        if(this.bot.canMelee()){
            this.bot.setBehavior(BEHAVIORS.MELEE);
        }else if(this.bot.hasPath()){
            this.bot.setBehavior(BEHAVIORS.FOLLOW_PATH);
        }else{
            this.bot.setBehavior(BEHAVIORS.IDLE);
        }
    }
    return task;
}