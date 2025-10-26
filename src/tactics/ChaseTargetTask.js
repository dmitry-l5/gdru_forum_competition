import { BaseTask } from "../BaseTask";
import { TACTICAL_TASKS } from "../tuneup/common_const";
import { Vector3 } from "@babylonjs/core";

export function ChaseTargetTask() {}

ChaseTargetTask.prototype = Object.create(BaseTask);
ChaseTargetTask.prototype.constructor = ChaseTargetTask;

ChaseTargetTask.prototype.update = function() {
    const chaseTaskDef = {
        type: TACTICAL_TASKS.CHASE_TARGET,
        target: this.target,
        sequence: [{ action: 'followPath', duration: null }],
        condition: () => {
            const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
            const hasRangedAttack = this.bot.options?.[ATTACK_TYPE.RANGED] ?? false;
            const rangedDistance = this.bot.options?.rangedAttackDistance ?? Infinity;
            const hasMeleeAttack = this.bot.options?.[ATTACK_TYPE.MELEE] ?? false;
            const meleeDistance = this.bot.options?.meleeAttackDistance ?? 0;

            return (hasMeleeAttack && dist <= meleeDistance) || (hasRangedAttack && dist <= rangedDistance);
        }
    };
    if (this.bot.currentBehavior && this.bot.currentBehavior.setTask) {
        this.bot.currentBehavior.setTask(chaseTaskDef);
    }
};

ChaseTargetTask.prototype.breakCondition = function() {
    if (BaseTask.breakCondition.call(this)) {
        return true;
    }
    const dist = Vector3.Distance(this.bot.root.position, this.target.root.position);
    const hasRangedAttack = this.bot.options?.[ATTACK_TYPE.RANGED] ?? false;
    const rangedDistance = this.bot.options?.rangedAttackDistance ?? Infinity;
    const hasMeleeAttack = this.bot.options?.[ATTACK_TYPE.MELEE] ?? false;
    const meleeDistance = this.bot.options?.meleeAttackDistance ?? 0;

    return (hasMeleeAttack && dist <= meleeDistance) || (hasRangedAttack && dist <= rangedDistance);
};