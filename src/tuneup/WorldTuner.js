import { World } from "../World";
import { MAPS_ID } from "./maps_const";

import { Mesh, Ray, Vector3 } from "@babylonjs/core";
import { Player } from "./Player";
import { MODELS_ID } from "./resource_const";

export function WorldTuner(app, options) {
    const { inputManager, gameDataManager, resourceLoader } = options;
    World.call(this, app, options);
    this.gameDataManaget = gameDataManager;
    this.resourceLoader = resourceLoader;
    this.inputManager = inputManager;
    this.player = null;

    this._setupInputHandlers();
    this._setupGameLoopObservers();
}
WorldTuner.prototype = Object.create(World.prototype);
WorldTuner.prototype.constructor = WorldTuner;

WorldTuner.prototype._setupInputHandlers = function() {
    this.inputManager.onActionTriggeredObservable.add((actionInfo) => {
        if (!this.player) return;
        if (actionInfo.action === "jump" && actionInfo.value === true) {
            console.log("Player Jump!");
        }
    });

    this.inputManager.onPointerClickObservable.add((pickedPoint) => {
        if (this.player && pickedPoint) {
            const path = this.pathfinder.findPath(this.player.root.position, pickedPoint);
            if (path && path.length > 0) {
                this.player.setPath(path);
                console.log(`WorldTuner: Игроку назначен путь с ${path.length} точками.`);
            } else {
                console.log("WorldTuner: Путь не найден для игрока до указанной точки.");
                this.player.stopMoving();
            }
        }
    });

};

WorldTuner.prototype._setupGameLoopObservers = function() {
    console.warn(this.app.scene);
    this.app.scene.onBeforeRenderObservable.add(() => { 
        const deltaTime = this.app.engine.getDeltaTime() / 1000.0;
        if (this.player) {
            this.player.update(deltaTime);
        }

    });
};

WorldTuner.prototype.loadLevel = async function(levelName, onProgress = null) {
    console.log(`Загрузка уровня (карты): ${levelName}...`);
    await this.loadMap(levelName, onProgress);
    this.player = new Player(this.scene, new Vector3(0, 0, 0), { gameDataManager: this.gameDataManager, resourceLoader: this.resourceLoader } );
    if(this.playground.cameraMainLocation){ 
        this.app.cameras.setPosition(this.playground.cameraMainLocation.position);
        this.app.cameras.setTarget(Vector3.Zero());
    }
    
    this.player.init(MODELS_ID.HERO_BASE);
    console.log(`Уровень "${levelName}" загружен.`);
    console.log("WorldTuner: Загрузка карты завершена. Начинаем построение NavMesh...");

    

};

WorldTuner.prototype.unloadLevel = function() {
    console.log(`Выгрузка текущего уровня...`);
    this.player.dispose();
    this.player = null;
    World.prototype.unloadMap.call(this);
};