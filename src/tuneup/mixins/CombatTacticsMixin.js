import { MeleeAttackTask } from "../../tactics/MeleeAttackTask";
import { RangedAttackTask } from "../../tactics/RangedAttackTask";
import { TACTICS } from "../strategy_const";

export function CombatTacticsMixin(){}

CombatTacticsMixin.init = function(){
    const strategies = {
        [TACTICS.CHASE_AND_BEAT]:MeleeAttackTask,
        [TACTICS.CHASE_AND_SHOOT]:RangedAttackTask,
    }
    return strategies;
}