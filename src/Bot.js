import { Character } from "./Character";
import { Vector3, Quaternion } from "@babylonjs/core";
import { CHAR_GROUPS, ATTACK_TYPE, PROJECTILE_TYPE, PLAYGROUND_ACTIONS, ANIMATOR_STATE, BEHAVIORS } from "./tuneup/common_const";
import { TacticalCombatState } from "./tuneup/bots/behaviors/TacticalCombatState";
import { MeleeState } from "./tuneup/bots/behaviors/MeleeState";
// import StrategyFactory from "./tuneup/bots/behaviors/StrategyFactory";

/**
 * @class Bot
 * @param {BABYLON.Scene} scene - Сцена Babylon.js.
 * @param {BABYLON.Vector3} position - Начальная позиция бота.
 * @param {object} options - Объект с дополнительными параметрами.
 * @param {WorldTuner} options.world - Ссылка на WorldTuner.
 * @param {Pathfinder} options.pathfinder - Экземпляр Pathfinder.
 * @param {ResourceLoader} options.resourceLoader - Менеджер ресурсов.
 * @param {Playground} options.playground - Ссылка на Playground.
 * @param {function} options.playgroundActionCallback - Колбэк для выполнения действий в Playground (например, создание снарядов).
 * @param {string} [options.projectileType] - Тип снаряда, который выпускает бот.
 * @param {boolean} [options.ATTACK_TYPE.MELEE] - Может ли бот атаковать в ближнем бою.
 * @param {number} [options.meleeAttackDistance] - Дистанция для ближнего боя.
 * @param {boolean} [options.ATTACK_TYPE.RANGED] - Может ли бот атаковать на расстоянии.
 * @param {number} [options.rangedAttackDistance] - Дистанция для дальней атаки.
 */
export function Bot(scene, position, options) {
    Character.call(this, scene, options);

    this.root.name = 'bot.root';
    this.root.position = new Vector3(position.x, position.y, position.z);
    this.group = CHAR_GROUPS.BOT;

    this.target = null;
    this.inCombat = false;

    this[ATTACK_TYPE.MELEE] = options[ATTACK_TYPE.MELEE] !== undefined ? options[ATTACK_TYPE.MELEE] : true;
    this.meleeAttackDistance = options.meleeAttackDistance !== undefined ? options.meleeAttackDistance : 3;
    
    this[ATTACK_TYPE.RANGED] = options[ATTACK_TYPE.RANGED] !== undefined ? options[ATTACK_TYPE.RANGED] : true;
    this.rangedAttackDistance = options.rangedAttackDistance !== undefined ? options.rangedAttackDistance : 10;

    this.favoriteAttackType = options.favoriteAttackType !== undefined ? options.favoriteAttackType:ATTACK_TYPE.NONE;
    
    this.playgroundActionCallback = options.playgroundActionCallback;
    this.projectileType = options.projectileType || PROJECTILE_TYPE.DEFAULT; 
    this.sightRadius = options.sightRadius !== undefined ? options.sightRadius : 20;
    this.pursuitRange = options.pursuitRange !== undefined ? options.pursuitRange : 25;
    this.stopPursuitRange = options.stopPursuitRange !== undefined ? options.stopPursuitRange : 30;
    this.behaviors = {
        ...this.behaviors, 
        [BEHAVIORS.COMBAT]: TacticalCombatState,
        [BEHAVIORS.MELEE]: MeleeState,
    };

}

Bot.prototype = Object.create(Character.prototype);
Bot.prototype.constructor = Bot;

Bot.prototype.setTarget = function(target) {
    this.target = target;
};

Bot.prototype.update = function(deltaTime) {
    if (this.isDead) return;
    Character.prototype.update.call(this, deltaTime);
};

Character.prototype.seesTarget = function(target_position = null){
    if(target_position instanceof Vector3){
        return Vector3.Distance(this.root.position, target_position) < this.sightRadius;
    }
    if(this.target && ( this.target instanceof Vector3 ) ){
        return Vector3.Distance(this.root.position, this.target) < this.sightRadius;
    }
    if(this.target?.root?.position ){
        return Vector3.Distance(this.root.position, this.target.root.position) < this.sightRadius;
    }
    return false;
    
}

Bot.prototype.performAttack = function(targetPosition, options) {
    if (this.isDead) return;
    console.log(`Bot - ${this.constructor.name} - perform attack`);
    

    const { distance, attackType } = options;
    const directionToTarget = targetPosition.subtract(this.root.position).normalize();
    const targetRotation = Quaternion.FromLookDirectionRH(directionToTarget, Vector3.Up());
    this.root.rotationQuaternion = Quaternion.Slerp(this.root.rotationQuaternion || Quaternion.Identity(), targetRotation, 0.2);

    if (attackType === ATTACK_TYPE.RANGED) {
        this.setBehavior(BEHAVIORS.ATTACK);
        // this.changeState(ANIMATOR_STATE.ATTACK); 
        if (this.playgroundActionCallback) {
            const projectileDirection = targetPosition.subtract(this.root.position).normalize();
            this.playgroundActionCallback(
                PLAYGROUND_ACTIONS.CREATE_PROJECTILE,
                {
                    type: this.projectileType,
                    position: this.root.position.add(new Vector3(0, 2, 0)),
                    direction: projectileDirection,
                    owner: this
                }
            );
        }
    } else if (attackType === ATTACK_TYPE.MELEE) {
        this.setBehavior(BEHAVIORS.ATTACK);

        // this.changeState(ANIMATOR_STATE.ATTACK); 
        // this.animator?.attack?.(); 
        // this.animator?.punch?.(); 

    } else {
        //  console.warn(`Bot::performAttack - Неизвестный или необработанный тип атаки: ${attackType}`);
    }
};

Bot.prototype.moveTo = function(targetPosition, deltaTime) {
    this.move(targetPosition.subtract(this.root.position), this.stats.speed, deltaTime);    
};

Bot.prototype.performAttack = function(options) {
    const { attackType = ATTACK_TYPE.MELEE } = options;    
    console.log(`Бот ${this.root.name} выполняет атаку типа ${attackType}.`);

    this.animator.play(ANIMATOR_STATE.ATTACK, { loop: false, onEndCallback: () => this.animator.play(ANIMATOR_STATE.IDLE) });
};

Bot.prototype.performSpecialAttack = function(options) {
    const { attackType = ATTACK_TYPE.MELEE } = options;    
    console.log(`Бот ${this.root.name} выполняет специальную атаку типа ${attackType}.`);
    this.animator.play(ANIMATOR_STATE.ATTACK_PUNCH, { loop: false, onEndCallback: () => this.animator.play(ANIMATOR_STATE.IDLE) });
};