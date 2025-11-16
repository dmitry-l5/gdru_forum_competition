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
    const livingPlayerUnits = Object.values(this.playground.playerTeam)
        .filter(unit => unit && unit.stats?.health > 0);
    for (const bot of this.activeBots) {
        let currentTarget = bot.target;
        if (this.activeTasks.has(bot)){
            const activeTask = this.activeTasks.get(bot);

            if(activeTask.isCompleted){
                activeTask?.dispatch?.();
                this.activeTasks.delete(bot);
            }
            else if (currentTarget) { 
                const path = this.playground.world.pathfinder.findPath(bot.root.position, currentTarget.root.position);
                bot.setPath(path);
            }
            if(!activeTask.breakCondition()) {
                continue; 
            }
        }
        let closestTarget = null;
        let minDistanceSq = Infinity;
        livingPlayerUnits.forEach(unit => {
            const distanceSq = Vector3.DistanceSquared(bot.root.position, unit.root.position);
            
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestTarget = unit;
            }
        });
        if (closestTarget) {
            if (bot.favoriteAttackType &&
                bot.favoriteAttackType === ATTACK_TYPE.MELEE &&
                bot.seesTarget(closestTarget.root.position)
            ){
                bot.setTarget(closestTarget); 
                const task = this.tactics[TACTICS.CHASE_AND_BEAT]({ bot: bot, target: closestTarget});
                this.assignTask(bot, task);
            }
        }
    }
};

CombatManager.prototype.assignTask = function(bot, task) {
    if(!task) return;
    // debugger
    this.activeTasks.set(bot, task);
};

CombatManager.prototype.update = function(deltaTime) {
    const livingPlayerUnits = Object.values(this.playground.playerTeam)
        .filter(unit => unit && unit.stats?.health > 0);
    if (livingPlayerUnits.length === 0) {
        for (const bot of [...this.activeBots]) {
             this.removeBotFromCombat(bot);
        }
        return;
    }
    for (const bot of this.activeBots) {
        if (bot.isDead) {
            this.removeBotFromCombat(bot);
            continue;
        }
        let minDistanceSq = Infinity;
        let isTargetInRange = false;
        livingPlayerUnits.forEach(unit => {
            const distanceSq = Vector3.DistanceSquared(bot.root.position, unit.root.position);
            minDistanceSq = Math.min(minDistanceSq, distanceSq);
        });
        const minDistance = Math.sqrt(minDistanceSq);
        if (minDistance > bot.stopPursuitRange) {
            this.removeBotFromCombat(bot);
            continue;
        }
    }
    this.evaluateStrategies(); 

    for(const [bot, task] of this.activeTasks){
        task.run(deltaTime);
    }
}