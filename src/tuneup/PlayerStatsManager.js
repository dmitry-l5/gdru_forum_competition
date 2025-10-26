// tuneup/PlayerStatsManager.js
import { Observable } from "@babylonjs/core/Misc/observable";
import { DataManager } from "../DataManager";

export function PlayerStatsManager() {
    DataManager.call(this);

    this.stats = {
        health: 100,
        mana: 50,
        stamina: 75,
        level: 1,
        experience: 0,
        score: 101010,
        speed: 10,
        speed_max: 2,
    };

    this.onHealthChanged = new Observable();
    this.onManaChanged = new Observable();
    this.onStaminaChanged = new Observable();
    this.onLevelUp = new Observable();
    this.onExperienceGained = new Observable();
    this.onScoreChanged = new Observable();
}

PlayerStatsManager.prototype = Object.create(DataManager.prototype);
PlayerStatsManager.prototype.constructor = PlayerStatsManager;

PlayerStatsManager.prototype.getHealth = function() {
    return this.stats.health;
}
PlayerStatsManager.prototype.setHealth = function(newHealth) {
    newHealth = Math.max(0, Math.min(100, newHealth));
    if (this.stats.health !== newHealth) {
        this.stats.health = newHealth;
        this.onHealthChanged.notifyObservers(this.stats.health);
        console.log(`Здоровье игрока обновлено до: ${this.stats.health}`);
    }
};

PlayerStatsManager.prototype.getMana = function() {
    return this.stats.mana;
}
PlayerStatsManager.prototype.setMana = function(newMana) {
    newMana = Math.max(0, Math.min(this.stats.mana_max || 100, newMana));
    if (this.stats.mana !== newMana) {
        this.stats.mana = newMana;
        this.onManaChanged.notifyObservers(this.stats.mana);
        console.log(`Мана игрока обновлена до: ${this.stats.mana}`);
    }
};
PlayerStatsManager.prototype.getSpeed = function() {
    return this.stats.speed;
}
PlayerStatsManager.prototype.setSpeed = function(newSpeed) {
    newSpeed = Math.max(0, Math.min(this.stats.speed_max || 100, newSpeed));
    if (this.stats.speed !== newSpeed) {
        this.stats.speed = newSpeed;
        this.onManaChanged.notifyObservers(this.stats.speed);
        console.log(`Мана игрока обновлена до: ${this.stats.speed}`);
    }
};

PlayerStatsManager.prototype.getStamina = function() {
    return this.stats.stamina;
}
PlayerStatsManager.prototype.setStamina = function(newStamina) {
    newStamina = Math.max(0, Math.min(this.stats.stamina_max || 100, newStamina));
    if (this.stats.stamina !== newStamina) {
        this.stats.stamina = newStamina;
        this.onStaminaChanged.notifyObservers(this.stats.stamina);
        console.log(`Выносливость игрока обновлена до: ${this.stats.stamina}`);
    }
};

PlayerStatsManager.prototype.getLevel = function() {
    return this.stats.level;
}
PlayerStatsManager.prototype.setLevel = function(newLevel) {
    if (this.stats.level !== newLevel) {
        this.stats.level = newLevel;
        this.onLevelUp.notifyObservers(this.stats.level);
        console.log(`Уровень игрока обновлен до: ${this.stats.level}`);
    }
};

PlayerStatsManager.prototype.getExperience = function() {
    return this.stats.experience;
}
PlayerStatsManager.prototype.setExperience = function(newExperience) {
    if (this.stats.experience !== newExperience) {
        this.stats.experience = newExperience;
        this.onExperienceGained.notifyObservers(this.stats.experience);
        console.log(`Опыт игрока обновлен до: ${this.stats.experience}`);
        const threshold = this._getLevelUpThreshold(this.stats.level);
        if (this.stats.experience >= threshold) {
            this.stats.level++;
            this.onLevelUp.notifyObservers(this.stats.level);
            console.log(`Игрок повысил уровень до: ${this.stats.level}`);
        }
    }
};

PlayerStatsManager.prototype.addExperience = function(amount) {
    this.setExperience(this.stats.experience + amount);
};

PlayerStatsManager.prototype.getScore = function() {
    return this.stats.score;
}
PlayerStatsManager.prototype.setScore = function(newScore) {
    if (this.stats.score !== newScore) {
        this.stats.score = newScore;
        this.onScoreChanged.notifyObservers(this.stats.score);
        console.log(`Очки игрока обновлены до: ${this.stats.score}`);
    }
};
PlayerStatsManager.prototype.addScore = function(value) {
    this.setScore(this.stats.score + value);
}

PlayerStatsManager.prototype._getLevelUpThreshold = function(currentLevel) {
    return 100 * currentLevel;
};

PlayerStatsManager.prototype.dispose = function() {
    DataManager.prototype.dispose.call(this);
    this.onHealthChanged.clear();
    this.onManaChanged.clear();
    this.onStaminaChanged.clear();
    this.onLevelUp.clear();
    this.onExperienceGained.clear();
    this.onScoreChanged.clear();
};