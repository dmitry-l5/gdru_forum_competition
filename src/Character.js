import { AbstractMesh, AnimationGroup, SceneLoader, TransformNode, Vector3, Quaternion, Axis, LoadAssetContainerAsync, FollowBehavior } from "@babylonjs/core";
import { Animator } from "./Animator";
import { ANIMATOR_CALLBACK_NAME, ANIMATOR_STATE, ANIMATOR_STATE_META, BEHAVIORS, CHAR_GROUPS } from "./tuneup/common_const";
import { CHARACTER_STATE } from "./CHARACTER_STATE";
import { IdleState } from "./tuneup/bots/behaviors/IdleState";
import { TacticalCombatState } from "./tuneup/bots/behaviors/TacticalCombatState";
import { FollowPathState } from "./tuneup/bots/behaviors/FollowPathState";
import { State } from "./tuneup/bots/behaviors/State";

export function Character(scene, options) {
    const {resourceLoader,} = options;
    this.scene = scene;
    this.resourceLoader = resourceLoader;
    this.world = options.world;
    this.containers = {};
    this.rotationCorrection = Vector3.Zero();

    this.root = new TransformNode("characterRoot", this.scene);
    this.root.scaling = Vector3.One();
    this.root.rotationQuaternion = Quaternion.Identity(); 

    this.stats = {
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        speed: 1,
    };





    this.animatorState = null;
    this.baseModelInstance = null;
    this.isTransitioning = null;
    // this.meshes = [];
    // this.animationGroups = [];

    this.animator = null;
    this.isDead = false;
    this.isMoving = false;

    this._path = [];
    Object.defineProperty(this, 'path', {
        get: function() { return this._path; },
        // set: function(value) { this.playerStatsManager.setHealth(value); },
        // enumerable: true,
        // configurable: true
    });
    this._currentWaypointIndex = 0;
    this.waypointReachedThreshold = 0.5; 

    this.group = CHAR_GROUPS.NEUTRAL;
    this.isHostile = false;
    this.status = 'passive';

    this.currentBehavior = null;
    this.currentBehaviorArgs = {};
    this.nextBehaviorId = null;
    this.nextBehaviorArgs = null;
    this.lockBehavior = false;

    this.behaviors = {
        [BEHAVIORS.IDLE]: IdleState,
        [BEHAVIORS.FOLLOW_PATH]: FollowPathState,
        // ... .
    };

}

Character.prototype = Object.create(null);
Character.prototype.constructor = Character;

Character.prototype.init = async function(modelId){
    await this.loadModel(modelId);
    const config = this.resourceLoader.getModelMeta(modelId);
    this.animator = new Animator(config.ANIMATIONS??null);
    this.animator.init(config.ANIMATIONS, this.baseInstance.animationGroups);
    const initializedBehaviors = {};
    for (const [key, BehaviorClass] of Object.entries(this.behaviors)) {
        initializedBehaviors[key] = new BehaviorClass(this, this.animator);
    }
    this.behaviors = initializedBehaviors;
    this.setBehavior(BEHAVIORS.IDLE);
}


Character.prototype[ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END] = function(){
    console.warn('----------   ANIMATOR_CALLBACK_NAME.MELEE_ATTACK_END   ----------');
    console.warn(this);
    this.changeAnimatorState();
    if(this.nextBehaviorId)
        this.nextBehavior();
    this.lockBehavior = false;
}
Character.prototype[ANIMATOR_CALLBACK_NAME.RANGED_ATTACK_END] = function(){
    console.warn('----------   ANIMATOR_CALLBACK_NAME.RANGED_ATTACK_END   ----------');
    console.warn(this);
    this.changeAnimatorState();
    if(this.nextBehaviorId)
        this.nextBehavior();
    this.lockBehavior = false;
}

Character.prototype.nextBehavior = function(){
    const nextBehaviorId = this.nextBehaviorId;
    const nextBehaviorArgs = this.nextBehaviorArgs;
    this.nextBehaviorId = null;
    this.nextBehaviorArgs = null;
    this.setBehavior(nextBehaviorId, nextBehaviorArgs);
}

Character.prototype.canMelee = function(){
    return true;
}

Character.prototype.changeAnimatorState = function(animator_state_const = null) {
    if(!animator_state_const){
        this.animator.stop();
        this.animatorState = null;
    }
    // console.log('change state - ' + animator_state_const);
    
    if(this.animatorState !== animator_state_const ){
        // console.warn('change state - ' + animator_state_const);
        // if(animator_state_const === ANIMATOR_STATE.ATTACK)
            // debugger;
        let callback = null;
        let loop = true;
        const meta = ANIMATOR_STATE_META[animator_state_const];
        if(meta){
            callback = this[meta.callback];
            loop = meta.loop;
        }
        if(callback)
            callback = callback.bind(this);
        this.animatorState = this.animator?.play(animator_state_const, 
            {
                loop: loop,
                onEndCallback: callback
            }
        );  
    }
};

Character.prototype.animationEndCallback = function(){
    console.warn('Animation End Callback');
    console.log(this);
    console.log('Animation End Callback');
    
    
}

Character.prototype.setRotationCorrection = function(rot){
    this.rotationCorrection = rot;
    const models = this.root.getChildren(undefined, true);
    models.forEach(item=>item.rotation  = this.rotationCorrection);
}


Character.prototype.loadModel = async function(modelId) {
    if (!this.resourceLoader) {
        //  console.error("ResourceLoader не предоставлен для Character.");
        return;
    }
    const meta = this.resourceLoader.getModelMeta(modelId);
    if (!meta) {
        //  console.error(`Метаданные модели с ID ${modelId} не найдены.`);
        return;
    }
    try {
        const ext = `.${meta.PATH.split('.').pop()}`;
        if (!ext) {
            throw new Error(`Неизвестное расширение файла: ${mapMeta.PATH}`);
        }
        const file = await this.resourceLoader.getFile(meta.PATH, meta.CHUNK, { format: 'arraybuffer' });
        const container = await LoadAssetContainerAsync(file, this.scene, {
            pluginExtension: ext,
            pluginOptions:{
                gltf:{
                    extensionOptions:{
                        ExtrasAsMetadata:{enabled:true}
                    }
                }
            }
        });

        this.containers[modelId] = container;
        const instantiated = this.baseInstance = container.instantiateModelsToScene(name=>name, false);
        const base = this.baseModelInstance = instantiated.rootNodes[0]??null;
        if(base){
            base.parent = this.root;
            base.scaling = Vector3.One();
            base.rotation = this.rotationCorrection;
        }
        // this.animator.init(this.meshes, this.animationGroups);
        // this.animator.idle();
        //  console.log(`Модель ${modelId} загружена для персонажа.`);
    } catch (error) {
        //  console.error(`Ошибка при загрузке модели ${modelId}:`, error);
        throw error;
    }
};

Character.prototype.changeHealth = function(amount) {
    this.stats.health += amount;
    this.stats.health = Math.max(0, Math.min(this.stats.maxHealth, this.stats.health));
    //  console.log(`${this.root.name} Здоровье: ${this.stats.health}/${this.stats.maxHealth}`);

    if (amount < 0 && this.stats.health > 0) {
        this.changeAnimatorState(ANIMATOR_STATE.HIT);
    }

    if (this.stats.health <= 0 && !this.isDead) {
        this.die();
    }
};

Character.prototype.hasPath = function(){
    return this._path && this._path.length > 0;
}

Character.prototype.isPathOutdated = function(targetPosition) {
    if (!this.hasPath()) {
        return false;
    }

    const pathLastPoint = this._path[this._path.length - 1];
    if (!pathLastPoint) {
        return true;
    }

    const isPositionOutdated = Vector3.Distance(pathLastPoint, targetPosition) > this.waypointReachedThreshold * 5;

    return isPositionOutdated;
};

Character.prototype.move = function(direction, speed, deltaTime) {
    if (this.isDead) return;
    if (direction.lengthSquared() < 0.0001) {
        // this.stopMoving();
        return;
    }
    const normalizedDirection = direction.normalize();
    const targetQuaternion = Quaternion.FromLookDirectionRH(normalizedDirection, Vector3.Up());
    const currentQuaternion = this.root.rotationQuaternion || Quaternion.Identity();
    this.root.rotationQuaternion = Quaternion.Slerp(currentQuaternion, targetQuaternion, 0.1);
    const displacement = normalizedDirection.scale(speed * deltaTime);
    this.root.position.addInPlace(displacement);
    this.isMoving = true;
    this.changeAnimatorState(ANIMATOR_STATE.RUN);
    // this.animator.play( ANIMATOR_STATE.RUN, { speed: speed * 100});
};

Character.prototype.stopMoving = function() {
    if (this.isDead) return;
    this.isMoving = false;
    this._path = [];
    this._currentWaypointIndex = 0;
    this.changeAnimatorState(ANIMATOR_STATE.IDLE);
};

Character.prototype.setPath = function(path) {
    if (path && path.length > 0) {
        this._path = path;
        this.isMoving = true; 
        this._currentWaypointIndex = 0;
        this.isMoving = true;
        //  console.log(`Character: Путь из ${path.length} точек установлен.`);
    } else {
        //  console.log("Character: Получен пустой или некорректный путь.");
        this.stopMoving();
    }
};

Character.prototype.setBehavior = async function(stateName, options = {}) {
    if (!(this.behaviors[stateName] instanceof State)) {
        console.warn(`Behavior handler for ${stateName} not found on bot '${this.root.name}'.`);
        return;
    }

    if (this.isTransitioning) {
        if (stateName !== BEHAVIORS.HIT) {
            this.nextBehaviorId = stateName;
            this.nextBehaviorArgs = options;
        }
        return;
    }

    if (this.lockBehavior && stateName !== BEHAVIORS.HIT) {
        this.nextBehaviorId = stateName;
        this.nextBehaviorArgs = options;
        return;
    }

    if (this.currentBehavior && this.currentBehavior.name === stateName) {
        return;
    }

    this.isTransitioning = true;
    try {
        if (this.currentBehavior && typeof this.currentBehavior.exit === 'function') {
            await this.currentBehavior.exit();
        }
        
        const newBehavior = this.behaviors[stateName];
        if (newBehavior) {
            this.currentBehavior = newBehavior;
            this.currentBehavior.name = stateName;
            if (typeof this.currentBehavior.enter === 'function') {
                await this.currentBehavior.enter(options);
            }
            if (stateName === BEHAVIORS.HIT) {
                this.lockBehavior = true;
            }
            // if (this.world.combatManager && (stateName === BEHAVIORS.ATTACK || stateName === BEHAVIORS.FOLLOW_PATH)) {
            //     this.world.combatManager.addBotToCombat(this, this.target);
            // }
        } else {
            console.warn(`Behavior handler for ${stateName} not found on bot '${this.root.name}'.`);
        }
    } catch (error) {
        console.error(`Error during bot behavior transition for '${this.root.name}':`, error);
    } finally {
        this.isTransitioning = false;
        if (this.nextBehaviorId) {
            const nextId = this.nextBehaviorId;
            const nextArgs = this.nextBehaviorArgs;
            this.nextBehaviorId = null;
            this.nextBehaviorArgs = {};
            this.setBehavior(nextId, nextArgs);
        }
    }
};

Character.prototype.attackBehavior = function(options) {
    if(this.currentAnimatorState !== ANIMATOR_STATE.ATTACK){
        // this.stopMoving();
        this.changeAnimatorState(ANIMATOR_STATE.ATTACK);
    }
};

Character.prototype.hitBehavior = function(){

}
Character.prototype.idleBehavior = function(){
    if(this.currentAnimatorState !== ANIMATOR_STATE.IDLE)
        this.changeAnimanorState(ANIMATOR_STATE.IDLE);
}

Character.prototype.followPathBehavior = function(deltaTime){
    if (this._currentWaypointIndex >= this._path.length) {
        this.isMoving = false;
        this.stopMoving();
        console.log("Character: Конечная точка назначения достигнута.");
        this.currentBehavior = null;
        return;
    }
    const targetWaypoint = this._path[this._currentWaypointIndex];
    const distanceToWaypoint = Vector3.Distance(this.root.position, targetWaypoint);
    if (distanceToWaypoint <= this.waypointReachedThreshold) {
        this._currentWaypointIndex++;
        if (this._currentWaypointIndex >= this._path.length) {
            this.isMoving = false;
            this.stopMoving();
            console.log("Character: Конечная точка назначения достигнута (через путевые точки).");
            this.currentBehavior = null;
            return;
        }
        const nextWaypoint = this._path[this._currentWaypointIndex];
        const direction = nextWaypoint.subtract(this.root.position).normalize();
        this.move(direction, this.stats.speed, deltaTime);
    } else {
        const direction = targetWaypoint.subtract(this.root.position);
        this.move(direction, this.stats.speed, deltaTime);
    }
}

Character.prototype.update = function(deltaTime) {    
    if(this.currentBehavior){
       this.currentBehavior.update(deltaTime);
    }
};

Character.prototype.changeEnergy = function(amount) {
    this.stats.energy += amount;
    this.stats.energy = Math.max(0, Math.min(this.stats.maxEnergy, this.stats.energy));
    //  console.log(`${this.root.name} Энергия: ${this.stats.energy}/${this.stats.maxEnergy}`);
};

Character.prototype.dispose = function() {
    if (this.root) {
        this.root.dispose();
    }
    for (const modelId in this.containers) {
        if (this.containers.hasOwnProperty(modelId)) {
            const container = this.containers[modelId];
            if (container && !container.isDisposed) {
                 container.dispose();
            }
        }
    }
    if (this.animator) {
        this.animator.dispose();
    }
    //  console.log(`${this.constructor.name} ${this.root?.name} disposed.`);
};