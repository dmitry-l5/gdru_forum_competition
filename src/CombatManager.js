import { Vector3 } from "@babylonjs/core";
import { ANIMATOR_STATE, ATTACK_TYPE, BEHAVIORS } from "./tuneup/common_const";
import { BaseTask } from "./BaseTask";
import { CombatTacticsMixin } from "./tuneup/mixins/CombatTacticsMixin";
import { TACTICS } from "./tuneup/strategy_const";

export function CombatManager(playground) {
    this.playground = playground;
    this.activeBots = new Set(); 
    this.activeTasks = new Map();
    Object.assign(this, CombatTacticsMixin);
    this.tactics = CombatTacticsMixin.init();
}

CombatManager.prototype = Object.create(null);
CombatManager.prototype.constructor = CombatManager;

CombatManager.prototype.addBotToCombat = function(bot, target) {
    if (!this.activeBots.has(bot)) {
        bot.setTarget(target);
        this.activeBots.add(bot);
        // if (bot.strategies && Array.isArray(bot.strategies)) {
        //     bot.strategies.forEach(strategy => {
        //         this.availableStrategies.push({ bot, strategy });
        //     });
        // }
        bot.inCombat = true;
        bot.setBehavior(BEHAVIORS.COMBAT);
        console.log(`CombatManager: Бот '${bot.root.name}' добавлен в бой против '${target.root.name}'.`);
    }
};

CombatManager.prototype.removeBotFromCombat = function(bot) {
    if (this.activeBots.has(bot)) {
        bot.setTarget(null);
        this.activeBots.delete(bot);
        // this.availableStrategies = this.availableStrategies.filter(item => item.bot !== bot);
        this.activeTasks.delete(bot);
        bot.setBehavior(BEHAVIORS.IDLE);
        bot.inCombat = false;
        console.log(`CombatManager: Бот '${bot.root.name}' удален из боя.`);
    }
};

CombatManager.prototype.evaluateStrategies = function(options) {
    const { player } = options;
    for( const bot of this.activeBots){
        if (this.activeTasks.has(bot)){
            if(this.activeTasks.get(bot).isCompleted){

                this.activeTasks.get(bot)?.dispatch?.();
                this.activeTasks.delete(bot);
            }
            if(true || ( this.activeTasks.get(bot)?.pathRequest && player ) ) {
                const path =  this.playground.world.pathfinder.findPath(bot.root.position, player.root.position);
                bot.setPath(path);
            }
            if(!this.activeTasks.get(bot)?.breakCondition()) {
                continue;
            }
        }
        if( bot.favoriteAttackType &&
            bot.favoriteAttackType === ATTACK_TYPE.MELEE &&
            bot.seesTarget(player.root.position)
        ){
            bot.setTarget(player);
            const oppa =  this.tactics[TACTICS.CHASE_AND_BEAT]({ bot: bot, target: player});
            this.assignTask(bot, this.tactics[TACTICS.CHASE_AND_BEAT]({ bot: bot, target: player}));
        }
    }
};

CombatManager.prototype.assignTask = function(bot, task) {
    if(!task) return;
    // debugger
    this.activeTasks.set(bot, task);
};

CombatManager.prototype.update = function(deltaTime) {
    const player = this.playground.world.player;
    if (!player) return;

    for (const bot of this.activeBots) {
        if (bot.isDead) {
            this.removeBotFromCombat(bot);
            continue;
        }
        const distanceToPlayer = Vector3.Distance(bot.root.position, player.root.position);
        if (distanceToPlayer > bot.stopPursuitRange) {
            this.removeBotFromCombat(bot);
            continue;
        }
        if (!bot.target) {
            this.removeBotFromCombat(bot);
        }
    }
    this.evaluateStrategies({ player: player});

    for(const [bot, task] of this.activeTasks){
        // debugger;
        task.run(deltaTime);
    }
}
