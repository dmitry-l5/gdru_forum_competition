import { PlaygroundTagsMixin } from "./tuneup/mixins/PlaygroundTagsMixin";
import { Vector3 } from "@babylonjs/core";
import { BOT_FACTORY } from "./tuneup/bots/bot_factory";
import { PlaygroundBotBehaviorMixin } from "./tuneup/mixins/PlaygroundBotBehaviorMixin";
import { CombatManager } from "./CombatManager";
import { BEHAVIORS } from "./tuneup/common_const";
import { PlaygroundActionsMixin } from "./tuneup/mixins/PlaygroundActionsMixin";

export function Playground(world, options) {
    const { pathfinder, resourceLoader } = options;
    this.world = world;
    this.app = world.app;
    this.scene = world.app.scene;
    this.pathfinder = pathfinder;
    this.resourceLoader = resourceLoader;

    this.navMeshFloor = [];
    this.asset = null;
    this.navMeshSource = null;
    this.playerPositions = [];
    this.spawnPoints = [];
    this.shootPoints = [];
    this.triggerPoints = [];
    this.bots = [];
    this.neutrals = []; 
    this.projectiles = [];
    this.isLoaded = false;

    Object.assign(this, PlaygroundTagsMixin);
    Object.assign(this, PlaygroundBotBehaviorMixin);
    Object.assign(this, PlaygroundActionsMixin);
    if (typeof PlaygroundActionsMixin.initMixin === 'function') {
        PlaygroundActionsMixin.initMixin.call(this);
    } 

    this.combatManager = new CombatManager(this); 
}

Playground.prototype = Object.create(null);
Playground.prototype.constructor = Playground;

Playground.prototype.init = async function(asset) {
    this.asset = asset;
    const rootNode = asset.rootNodes[0];
    const nodesToParse = rootNode.getChildren(null, false);
    nodesToParse.forEach(node => {
        const props = node.metadata?.gltf?.extras;
        if (props) {
            for (const key in props) {
                const methodName = this.trueName(key);
                if (typeof this[methodName] === 'function') {
                    this[methodName](node, props[key], props);
                }
            }
        }
    });
    
    this.isLoaded = true;
    //  console.log("Playground: Уровень успешно инициализирован.");
};

Playground.prototype.handleSpawnPoints = function(spawn_points){
    const playerPosition = this.world.player.root.position;
    spawn_points.forEach(point => {
        if( !point.inProgress &&
            point.isEnabled?.() &&
            Vector3.Distance(playerPosition, point.location) <= point.radius
        ) {
                this.spawnBot(point);
                point.resetEnable();
        }
    });
}

Playground.prototype.update = function(deltaTime) {
    if(!deltaTime)
        deltaTime = this.app.engine.getDeltaTime() / 1000.0;
    if (!this.world.player || this.isLoaded === false) return;
    this.handleSpawnPoints(this.spawnPoints);

    const target = this.world.player;
    // bot.update();
    this.combatManager.update(deltaTime);
    this.bots.forEach(bot => {
        if (bot.inCombat === false){
            if (bot.seesTarget(target.root.position)) {
                this.combatManager.addBotToCombat(bot, target);
            } else {
                bot.setBehavior(BEHAVIORS.IDLE);
            }
        }
        bot.update(deltaTime);
    });
};

Playground.prototype.spawnBot = async function(point) {
    point.inProgress = true;
    try{
        if (!point.spawnedBot || point.spawnedBot.isDead) {
            const botType = point.botType;
            const constructor = BOT_FACTORY[botType];
            if (!constructor) {
                //  console.error(`Playground: Неизвестный тип бота: "${botType}". Спавн отменен.`);
                return;
            }
            const bot = new constructor(this.scene, point.location, {
                resourceLoader: this.resourceLoader,
                world: this.world,
                pathfinder: this.pathfinder,
                playground: this,
                playgroundActionCallback: this.handlePlaygroundAction.bind(this),
                sightRadius: 20,
                pursuitRange: 25,
                stopPursuitRange: 30,
                // [ATTACK_TYPE.MELEE]: true,
                // meleeAttackDistance: 3,
                // [ATTACK_TYPE.RANGED]: true,
                // rangedAttackDistance: 10,
                // preferredAttack: ATTACK_TYPE.MELEE,
                // projectileType: PROJECTILE_TYPE.DEFAULT
            });
            await bot.init();
            this.bots.push(bot);
            point.spawnedBot = bot;

            point.isTriggered = true;
            point.lastTriggerTime = Date.now();
            //  console.log(`Playground: Бот типа "${botType}" создан.`);
        }
    } catch(error) {
         console.error("Ошибка при спавне бота:", error);
    } finally {
        point.isSpawning = false;
    }
};


Playground.prototype.handleTriggerAction = function(trigger) {
    switch(trigger.action) {
        case 'open_door':
            // Логика открытия двери
            break;
        case 'play_audio':
            // Логика проигрывания звука
            break;
        default:
            //  console.warn(`Неизвестное действие триггера: ${trigger.action}`);
            break;
    }
};



Playground.prototype.destroy = function() {
    if (this.onAfterRenderObserver) {
        this.scene.onAfterRenderObservable.remove(this.onAfterRenderObserver);
    }
    
    this.bots.forEach(bot => bot.dispose());
    this.bots = [];
    
    this.projectiles.forEach(projectile => projectile.dispose());
    this.projectiles = [];
    
    this.asset = null;
    this.navMeshSource = null;
    this.playerPositions = {};
    this.spawnPoints = {};
    this.shootPoints = [];
    
    //  console.log("Playground: Ресурсы очищены.");
};