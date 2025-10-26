import { Vector3 } from "@babylonjs/core";

import { PlayerStatsManager } from "../tuneup/PlayerStatsManager";
import { MODELS_META } from "../tuneup/resource_const";
import { Character } from "../Character";
import { ANIMATOR_STATE } from "./common_const";

export function Player(scene, position, options) {
    const { gameDataManager, resourceLoader } = options;
    Character.call(this, scene, options);
    this.playerStatsManager = gameDataManager.playerStatsManager;
    this.root.name = 'player.root';
    this.root.position = new Vector3(position.x, position.y, position.z);
    this.stats = {};
    const player = this;
    Object.defineProperty(this.stats, 'health', {
        get: function() { return this.playerStatsManager.getHealth(); },
        set: function(value) { this.playerStatsManager.setHealth(value); },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.stats, 'mana', {
        get: function() { return this.playerStatsManager.getMana(); },
        set: function(value) { this.playerStatsManager.setMana(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(this.stats, 'speed', {
        get: function() { return player.playerStatsManager.getSpeed(); },
        set: function(value) { player.playerStatsManager.setSpeed(value); },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.stats, 'stamina', {
        get: function() { return this.playerStatsManager.getStamina(); },
        set: function(value) { this.playerStatsManager.setStamina(value); },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.stats, 'level', {
        get: function() { return this.playerStatsManager.getLevel(); },
        set: function(value) { this.playerStatsManager.setLevel(value); },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.stats, 'experience', {
        get: function() { return this.playerStatsManager.getExperience(); },
        set: function(value) { this.playerStatsManager.setExperience(value); },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.stats, 'score', {
        get: function() { return this.playerStatsManager.getScore(); },
        set: function(value) { this.playerStatsManager.setScore(value); },
        enumerable: true,
        configurable: true
    });
   this._pointerClickListener = null;
}


Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = async function(modelId) {
    await Character.prototype.init.call(this, modelId);
    this.setRotationCorrection(new Vector3( 0, 0, 0));
    this.playerStatsManager.onHealthChanged.add((newHealth) => {
        console.log(`Игрок: Здоровье обновлено через StatsManager: ${this.health}`);
        if (this.health <= 0 && !this.isDead) {
            this.die();
        } else if (newHealth < this.playerStatsManager.getHealth()) { 
            this.changeState(ANIMATOR_STATE.HIT);
        }
    });

    this.playerStatsManager.onManaChanged.add((newMana) => {
        console.log(`Игрок: Мана обновлена через StatsManager: ${this.mana}`);
    });

    this.playerStatsManager.onStaminaChanged.add((newStamina) => {
        console.log(`Игрок: Выносливость обновлена через StatsManager: ${this.stamina}`);
    });

    this.playerStatsManager.onLevelUp.add((newLevel) => {
        console.log(`Игрок: Уровень повышен до: ${this.level}`);
    });

    this.playerStatsManager.onExperienceGained.add((newExperience) => {
        console.log(`Игрок: Опыт: ${this.experience}`);
    });

    this.playerStatsManager.onScoreChanged.add((newScore) => {
        console.log(`Игрок: Очки: ${this.score}`);
    });
};

// Character.prototype.animationNames = function(){
//     return {
//         [ANIMATOR_STATE.IDLE]: ANIMATOR_STATE.IDLE,
//         [ANIMATOR_STATE.ATTACK]: ANIMATOR_STATE.ATTACK,
//         [ANIMATOR_STATE.WALK]: ANIMATOR_STATE.WALK,
//         [ANIMATOR_STATE.RUN]: ANIMATOR_STATE.RUN,
//         [ANIMATOR_STATE.HIT]: ANIMATOR_STATE.HIT,
//         [ANIMATOR_STATE.DIE]: ANIMATOR_STATE.DIE,
//         [ANIMATOR_STATE.TALK]: ANIMATOR_STATE.TALK,
//     }
// }

Player.prototype.changeHealth = function(amount) {
    this.playerStatsManager.setHealth(this.playerStatsManager.getHealth() + amount);
};

Player.prototype.update = function(deltaTime) {
    Character.prototype.update.call(this, deltaTime);
};

Player.prototype.changeEnergy = function(amount) {
    this.playerStatsManager.setMana(this.playerStatsManager.getMana() + amount);
};

Player.prototype.update = function(deltaTime) {
    if (this.isDead || !this.isMoving || !this._path || this._path.length === 0) {
        this.stopMoving();
        return;
    }
    
    
    if (this._currentWaypointIndex >= this._path.length) {
        this.isMoving = false;
        this.stopMoving();
        console.log("Игрок: Конечная точка назначения достигнута.");
        return;
    }
    
    const targetWaypoint = this._path[this._currentWaypointIndex];
    const distanceToWaypoint = Vector3.Distance(this.root.position, targetWaypoint);
    if (distanceToWaypoint <= this.waypointReachedThreshold) {
        this._currentWaypointIndex++;
        if (this._currentWaypointIndex >= this._path.length) {
            this.isMoving = false;
            this.stopMoving();
            return;
        }
        const nextWaypoint = this._path[this._currentWaypointIndex];
        const direction = nextWaypoint.subtract(this.root.position);
        this.move(direction, this.stats.speed, deltaTime); 
    } else {
        const direction = targetWaypoint.subtract(this.root.position);
        this.move(direction, this.stats.speed, deltaTime);
    }
};

Player.prototype.dispose = function() {
    Character.prototype.dispose.call(this); 
    if (this.playerStatsManager) {
        this.playerStatsManager.dispose();
    }
    console.log("Игрок был уничтожен.");
};