import { Bot } from "../../Bot";
import { ATTACK_TYPE } from "../common_const";
import { MODELS_ID } from "../resource_const";

export function Solder(scene, position, options) {
    const init_options = {
        [ATTACK_TYPE.MELEE]: true,
        [ATTACK_TYPE.RANGED]: false,
        meleeAttackDistance: 5,
        rangedAttackDistance: 10,
        favoriteAttackType: ATTACK_TYPE.MELEE,
    }
    Bot.call(this, scene, position, { ...init_options, ...options});
    this.speed = 1.5;
    this.stats.health = 50;
    this.stats.maxHealth = 50;    
}
Solder.prototype = Object.create(Bot.prototype);
Solder.prototype.constructor = Solder;

Solder.prototype.init = async function() {
    await Bot.prototype.init.call(this, MODELS_ID.SOLDER);
};