import { PlaygroundTagsMixin } from "./tuneup/mixins/PlaygroundTagsMixin";
import { Vector3 } from "@babylonjs/core";
import { BOT_FACTORY } from "./tuneup/bots/bot_factory";
import { PlaygroundBotBehaviorMixin } from "./tuneup/mixins/PlaygroundBotBehaviorMixin";
import { CombatManager } from "./CombatManager";

import { PlaygroundActionsMixin } from "./tuneup/mixins/PlaygroundActionsMixin";
import { TEAM_SLOTS } from "./tuneup/teams_const";


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
    // this.playerPositions = [];
    // this.spawnPoints = [];
    // this.shootPoints = [];
    // this.triggerPoints = [];
    this.bots = [];
    this.neutrals = []; 
    this.projectiles = [];
    this.playerTeam = {
        [TEAM_SLOTS.MAIN]:null,
        [TEAM_SLOTS.SECOND]:null,
        [TEAM_SLOTS.THIRD]:null,
    };
    this.selectedUnit = null;
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

Playground.prototype.customLogic = function(deltaTime){
    //Mast be overwrite
}

Playground.prototype.update = function(deltaTime) {
    if(!deltaTime)
        deltaTime = this.app.engine.getDeltaTime() / 1000.0;
    this.customLogic(deltaTime);

    // if (!this.world.player || this.isLoaded === false) return;
    // this.handleSpawnPoints(this.spawnPoints);

    // const target = this.world.player;
    // // bot.update();
    // this.combatManager.update(deltaTime);
    Object.values(this.playerTeam).forEach(unit => {
    if (unit) { 
        unit.update(deltaTime);
    }
});
    this.bots.forEach(bot => {
    //     if (bot.inCombat === false){
    //         if (bot.seesTarget(target.root.position)) {
    //             this.combatManager.addBotToCombat(bot, target);
    //         } else {
    //             bot.setBehavior(BEHAVIORS.IDLE);
    //         }
    //     }
        bot.update(deltaTime);
    });
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
