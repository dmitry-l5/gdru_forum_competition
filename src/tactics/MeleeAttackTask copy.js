import { BaseTask } from "../BaseTask";
import { TACTICAL_TASKS, ATTACK_TYPE } from "../tuneup/common_const";
import { Vector3 } from "@babylonjs/core";

export function MeleeAttackTask() {}

MeleeAttackTask.prototype = Object.create(BaseTask);
MeleeAttackTask.prototype.constructor = MeleeAttackTask;

MeleeAttackTask.prototype.update = function() {
    const meleeTaskDef = {
        type: TACTICAL_TASKS.MELEE_ATTACK,
        target: this.target,
        sequence: [{ action: 'meleeAttack', duration: 1000 }],
        condition: () => {
            const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
            const meleeDistance = this.bot.options?.meleeAttackDistance ?? 0;
            return dist <= meleeDistance;
        }
    };
    if (this.bot.currentBehavior && this.bot.currentBehavior.setTask) {
        this.bot.currentBehavior.setTask(meleeTaskDef);
    }
};

MeleeAttackTask.prototype.breakCondition = function() {
    if (BaseTask.breakCondition.call(this)) {
        return true;
    }
    const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
    const meleeDistance = this.bot.options?.meleeAttackDistance ?? 0;
    return dist > meleeDistance;
};