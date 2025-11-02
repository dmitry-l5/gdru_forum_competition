import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/loaders";

import { RES_CHUNKS } from "./tuneup/resource_const";
import { ResourceLoader } from "./ResourceLoader";
import { CamerasManager } from "./CamerasManager";
import { WorldTuner } from "./tuneup/WorldTuner";
import { AppUI } from "./AppUI";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { LAYOUTS_UI } from "./tuneup/ui/ui_const";
import { dictionary_ru } from "./tuneup/local/ru";
import { dictionary_en } from "./tuneup/local/en";
import Polylang from "polylang";
import { LANGS } from "./tuneup/common_const";
import { AppUIEventsMixin } from "./tuneup/mixins/AppUIEventsMixin";
import { GameDataManager } from "./GameDataManager";
import { InputManager } from "./InputManager";
import { MAPS_ID } from "./tuneup/maps_const";
import { LayoutUI } from "./LayoutUI";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Inspector } from "@babylonjs/inspector";
import { prototype } from "jszip";
import { AppCreateShowcaseMixin } from "./tuneup/mixins/AppCreateShowcaseMixin";
import { Color4, SceneLoader } from "@babylonjs/core";




export function App(canvas, options = {}){
    const {pre_load_screen = null, ysdk_manager = null, load_game_file = null} = options;
    this.loadGameForm = load_game_file;
    this.polylang = new Polylang();
    this.polylang.add('ru', dictionary_ru);
    this.polylang.add('en', dictionary_en);
    this.polylang.lang = LANGS.RU;

    this.ysdkManager = ysdk_manager;
    this.resourceLoader = new ResourceLoader();
    this.adTexture = null;
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.showcaseScene = null;
    this.activeScene = null;
    this.cameras = null;
    this.world = null;
    this.ui = null;
    this.gameDataManager = null;
    this.inputManager = null;
    SceneLoader.ShowLoadingScreen = false;

    Object.assign(this, AppUIEventsMixin);
    this.uiEventsInit();
    Object.assign(this, AppCreateShowcaseMixin);

    this.resourceLoader.require(RES_CHUNKS.REQUIRED)
    .then(
        ()=>{
            console.log('all right');
            try{
                this.start();
                // this.createTestScene();
            }catch(e){
                console.error(e);
                
            }
        }
    )
    .catch(
        ()=>{
            console.error('can`t download');   
        }
    );
}
App.prototype = Object.create(null);
App.prototype.constructor = App;

App.prototype.dispose = function() {
    this.inputManager?.dispose();
    this.cameras?.destroy();
    this.world?.unloadLevel();
    console.log("App disposed.");
};

App.prototype.start = async function(){
    this.gameDataManager = new GameDataManager();
    const engine = this.engine = new Engine(this.canvas);
    engine.loadingScreen = null;
    const scene = this.scene = new Scene(engine);
    scene.clearColor = new Color4(0.5, 0.2, 0.2, 1.0);
    this.showcase.scene = await this.createShowcase(engine);
    this.showcase.scene.clearColor = new Color4(0.5, 0.2, 0.2, 1.0);
    this.inputManager = new InputManager(this.scene, this.canvas);
    const cameras = this.cameras = new CamerasManager(this.inputManager, this);
    this.adTexture = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, this.scene);
    this.ui = new AppUI(this.adTexture, this.resourceLoader, this.polylang, this.gameDataManager, this.inputManager, this);
    this.ui.createUI();
    this.activeScene = this.scene;
    this.ui.showLayout(LAYOUTS_UI.MAIN, false);
    this.world = new WorldTuner( this, { inputManager: this.inputManager, gameDataManager: this.gameDataManager, resourceLoader: this.resourceLoader });
    this.inputManager.onActionTriggeredObservable.add((evt)=>{
        const {action, value, event} = evt;
        console.log(action);
        
        switch(action){
            case 'key_down_KeyO':
                this.activeScene = this.scene;
                break;
            case 'key_down_KeyP':
                console.warn(this.showcase.scene);
                
                this.activeScene = this.showcase.scene;
                break;
        }
        // {
        //             action: `key_down_${keyCode}`,
        //             value: true,
        //             event: kbInfo.event
        //         }
    });
    engine.runRenderLoop( () => {
        this.activeScene?.render?.();
    });
    window.addEventListener('resize', () => {
        engine.resize();
        this?.cameras?.resize?.();
    });
    // Inspector.Show();
}

App.prototype.uiHandler = function(type, detail){
    const handler = this.uiEventHandlers?.[type];
    if (handler) {
        handler.call(this, detail);
    } else {
        console.warn(`Unhandled UI event type: ${type}`, detail);
    }
}
App.prototype.newGame = function(){
    this.gameDataManager.initDataSet();
    this.teamManagementOpen();
    this.activeScene = this.showcase.scene;
    // this.reloadTeamScreen();

    // this.ui.showLayout(LAYOUTS_UI.CONTROL, false);
    // this.world.loadLevel(MAPS_ID.INTRO);
    //this.world.loadLevel(MAPS_ID.INTRO, (data)=>{console.log(data);});
}
App.prototype.teamManagementOpen = function(){
    this.reloadTeamScreen?.();
    let scene = (this.activeScene instanceof Scene)?this.activeScene:this.scene;
    scene.onAfterRenderObservable.addOnce(()=>{
        this.activeScene = this.showcaseScene;
    });
}
App.prototype.teamManagementClose = function(){
    let scene = (this.activeScene instanceof Scene)?this.activeScene:this.scene;
    scene.onAfterRenderObservable.addOnce(()=>{
        this.activeScene = this.scene;
    });
}