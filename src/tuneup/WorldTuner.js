import { Playground } from "../Playground";
import { World } from "../World";
import { PlaygroundTuner } from "./PlaygroundTuner";

export function WorldTuner(app, options) {
    const { inputManager, gameDataManager, resourceLoader } = options;
    options.playgroundConstructor = PlaygroundTuner;
    World.call(this, app, options);
    this.gameDataManager = gameDataManager;
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

    this.inputManager.onPointerClickObservable.add((pickResult) => {
        if(!(this.playground instanceof Playground)){
            return;
        }
        this.playground.handleClick(pickResult);
    });

};

WorldTuner.prototype._setupGameLoopObservers = function() {
    console.warn(this.app.scene);
    this.app.scene.onBeforeRenderObservable.add(() => { 
        const deltaTime = this.app.engine.getDeltaTime() / 1000.0;
        // if (this.player) {
        //     this.player.update(deltaTime);
        // }

    });
};

WorldTuner.prototype.loadLevel = async function(map_id, gate_id, onProgress = null, CustomPlaygroundTuner = null) {
    console.log(`Загрузка уровня (карты): ${map_id}...`);
    await this.loadMap(map_id, onProgress, CustomPlaygroundTuner);
    //this.player = new Player(this.scene, new Vector3(0, 0, 0), { gameDataManager: this.gameDataManager, resourceLoader: this.resourceLoader } );
    const team = this.gameDataManager.team;
    await this.playground.instantiatePlayerTeam(team, gate_id);
    // if(this.playground.cameraMainLocation){ 
    //     this.app.cameras.setPosition(this.playground.cameraMainLocation.position);
    //     this.app.cameras.setTarget(Vector3.Zero());
    // }
    // this.player.init(MODELS_ID.HERO_BASE);
    console.log(`Уровень "${map_id}" загружен.`);
    console.log("WorldTuner: Загрузка карты завершена. Начинаем построение NavMesh...");
};

WorldTuner.prototype.unloadLevel = function() {
    console.log(`Выгрузка текущего уровня...`);
    this.player.dispose();
    this.player = null;
    World.prototype.unloadMap.call(this);
};