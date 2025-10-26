import { Bot } from "../../Bot";
import { MODELS_ID } from "../resource_const";

export function HeavySolder(scene, position, options) {
    Bot.call(this, scene, position, options);
    
    this.speed = 0.8;
    this.stats.health = 150;
    this.stats.maxHealth = 150;
}
HeavySolder.prototype = Object.create(Bot.prototype);
HeavySolder.prototype.constructor = HeavySolder;

HeavySolder.prototype.init = async function() {
    await Bot.prototype.init.call(this, MODELS_ID.HEAVY_SOLDER);
};