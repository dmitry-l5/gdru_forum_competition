import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { HemisphericLight } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";
import { LoadAssetContainerAsync } from "@babylonjs/core";
import { MAPS_META } from "./tuneup/maps_const";
import { Pathfinder } from "./Pathfinder"; 
import { Playground } from "./Playground";

export function World(app, options){
    const {gameDataManager} = options;
    this.app = app;
    this.gameDataManager = gameDataManager;
    this.currentMapMeta = null;
    this.activeMeshes = [];
    this.lights = [];
    this.gameLoopObserver = null;

    this.containers = {}; 
    this.pathfinder = null;
    this.playground = null; 
    this.initPathfinder();
}
World.prototype = Object.create(null);
World.prototype.constructor = World;

World.prototype.initPathfinder = async function() {
    this.pathfinder = new Pathfinder(this.app.scene);
    await this.pathfinder.init();
};

World.prototype.loadMap = async function(MAP_ID, onProgress = null){
    console.log(`Попытка загрузки карты: ${MAP_ID}`);
    await this.flushMap();
    const mapMeta = MAPS_META[MAP_ID];
    if (!mapMeta) {
        return;
    }
    this.currentMapMeta = mapMeta;
    try {
        await this.loadResources(onProgress);
        const ext = `.${mapMeta.PATH.split('.').pop()}`;
        if (!ext) {
            throw new Error(`Неизвестное расширение файла: ${mapMeta.PATH}`);
        }
        
        const mapFile = await this.app.resourceLoader.getFile(mapMeta.PATH, mapMeta.CHUNK, { format: 'arraybuffer' });
        const container = await LoadAssetContainerAsync(mapFile, this.app.scene, {
            pluginExtension: ext,
            pluginOptions:{
                gltf:{
                    extensionOptions:{
                        ExtrasAsMetadata:{enabled:true}
                    }
                }
            }
        });

        this.containers[MAP_ID] = container; 
        const instantiatedNodes = container.instantiateModelsToScene(((name)=>name), false);      
        instantiatedNodes.rootNodes.forEach(node => {
            if (node instanceof AbstractMesh) {
                this.activeMeshes.push(node);
            }
            node.getChildMeshes(false, (child) => {
                this.activeMeshes.push(child);
            });
        });

        if (this.lights.length === 0) {
            const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.app.scene);
            this.lights.push(light);
        }
        this.playground = new Playground(this, {
            pathfinder: this.pathfinder,
            resourceLoader: this.resourceLoader
        });
        await this.playground.init(this.containers[MAP_ID]);
        await this.pathfinder.buildNavMesh(this.playground.navMeshFloor);
        this.pathfinder.displayNavMesh();
        this.administerGameProcess();
    } catch (error) {
        console.error('Error loading map:', error);
        throw error;
    }
}

World.prototype.flushMap = async function(){
    if (this.gameLoopObserver) {
        this.app.scene.onBeforeRenderObservable.remove(this.gameLoopObserver);
        this.gameLoopObserver = null;
    }

    this.activeMeshes.forEach(mesh => {
        if (mesh && !mesh.isDisposed()) {
            mesh.dispose();
        }
    });
    this.activeMeshes = [];

    this.lights.forEach(light => {
        if (light && !light.isDisposed()) {
            light.dispose();
        }
    });
    this.lights = [];

    for (const mapId in this.containers) {
        if (this.containers.hasOwnProperty(mapId)) {
            const container = this.containers[mapId];
            if (container) {
                container.dispose();
            }
        }
    }
    this.containers = {};
    this.currentMapMeta = null;

    if (this.pathfinder) {
        this.pathfinder.clearNavMesh();
    }

    this.app.scene.meshes.forEach(mesh => {
        if (mesh && !mesh.isDisposed() && mesh.name !== "camera_default") {
            mesh.dispose();
        }
    });

    this.app.scene.lights.forEach(light => {
        if (light && !light.isDisposed()) {
            light.dispose();
        }
    });
}

World.prototype.loadResources = async function(onOverallProgress = null){
    if (!this.currentMapMeta) {
        return;
    }

    const chunksToLoad = [this.currentMapMeta.CHUNK, ...(this.currentMapMeta.CHUNKS || [])];

    let loadedChunksCount = 0;
    const totalChunks = chunksToLoad.length;

    const loadPromises = chunksToLoad.map(chunk =>
        new Promise((resolve, reject) => {
            
            this.app.resourceLoader.require(chunk)
                .then(() => {
                    loadedChunksCount++;
                    const overallProgress = (loadedChunksCount / totalChunks) * 100;
                    if (typeof onOverallProgress === 'function') {
                        onOverallProgress(overallProgress, loadedChunksCount, totalChunks);
                    }
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        })
    );

    try {
        await Promise.all(loadPromises);
        console.log(`Все необходимые чанки для карты загружены/проверены.`);
    } catch (error) {
        console.error('Не удалось загрузить все необходимые ресурсы для карты:', error);
        throw error;
    }
}

World.prototype.administerGameProcess = function(){
    this.gameLoopObserver = this.app.scene.onBeforeRenderObservable.add(() => {
        const deltaTime = this.app.engine.getDeltaTime() / 1000.0;
        this.playground?.update?.(deltaTime);
    });
};
World.prototype.unloadMap = function(){
    if (this.player) {
        this.player.dispose();
        this.player = null;
    }
    if (this.playground) {
        this.playground.destroy();
        this.playground = null;
    }
    if (this.pathfinder) {
        this.pathfinder.reset(); 
    }

}