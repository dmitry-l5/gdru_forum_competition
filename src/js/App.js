import { Engine, Scene, Color3, HemisphericLight, Vector3, MeshBuilder, KeyboardEventTypes, Texture, SpriteManager, Size, Sprite } from "@babylonjs/core";
import { InputManager } from "./InputManager";
import { BaseApp } from "./BaseApp";
import { GUIManager } from "./GUIManager";
import { ResourceLoader } from "./ResourceLoader";
import { RES_CHUNKS } from "./consts/resource_const";
import { LAYOUTS_UI } from "./consts/ui_const";
import { AppUIEventsMixin } from "./mixins/AppUIEventsMixin";
import { MAPS_ID, MAPS_META } from "./consts/maps_const";
import { AppMapLoaderMixin } from "./mixins/AppMapLoaderMixin";

export function App(canvas, options = {}){
    BaseApp.call(this, canvas, options); 
    const {wasm_module} = options;
    this.wasmModule = wasm_module;
    this.wasmApp = new wasm_module.App(65832656);
    this.inputView = null;
    this.inputManager = new InputManager(this.scene, this.canvas);
    this.resourceLoader = new ResourceLoader();

    this.debugNavMap = false;
    // ADTexture = null, resourceLoader, polylang, gameDataManager, inputManager
    this.guiManager = new GUIManager(this, {
        ADTexture:null,
        resourceLoader:this.resourceLoader,
        polylang:this.polylang,
        gameDataManager:null,
        inputManager: null
     });

    Object.assign(this, AppUIEventsMixin);
    Object.assign(this, AppMapLoaderMixin);
    this.uiEventsInit();

    this.resourceLoader.require(RES_CHUNKS.REQUIRED)
    .then(
        ()=>{
            try{
                this.start();
            }catch(e){
                console.error(e);
            }
        }
    )
    .catch(
        (e)=>{
            console.error('can`t download resources');   
            console.error(e);   
        }
    );
}
App.prototype = Object.create(BaseApp.prototype);
App.prototype.constructor = App;

App.prototype.start = async function() {
    this.guiManager.init();
    this.guiManager.showLayout(LAYOUTS_UI.MAIN_MENU, false);
    if (this.wasmModule) {
        this._setupInput(); 
    } else {
        console.error("WASM Module not found. Cannot setup shared memory input.");
    }
}
App.prototype.appBeforeRender = function(deltaTime){
    if (this.wasmApp && this.wasmApp.update) {
        this.wasmApp.update(deltaTime);
    }
}

App.prototype._setupInput = function() {
    if (!this.wasmModule.getSharedInputPtr) {
        console.error("WASM Export 'getSharedInputPtr' not found. Recompile C++.");
        return;
    }
    if (!this.wasmModule.HEAP32 || !this.wasmModule.HEAP32.buffer) {
        console.error("WASM Memory Buffer (HEAP32) not available. Check the build flags.");
        return;
    }
    const memoryBuffer = this.wasmModule.HEAP32.buffer; 
    const inputPtr = this.wasmModule.getSharedInputPtr();
    this.inputManager.setSharedInputMapPtr(memoryBuffer, inputPtr);

    this.inputManager.onActionTriggeredObservable.add(
        (evt)=>{
            const {action, value, event} = evt;
            // console.warn(action);
            if(!this.debugNavMap && ( action === "key_up_Comma") ){
                this.showDebugNavMap?.();
            }
            if(this.debugNavMap && action === "key_down_Period"){
                this.hideDebugNavMap?.();
            }
            if(action === "key_down_ArrowDown"){
                this.scene.activeCamera.position.z += 0.25;
            }
            if(action == "key_down_ArrowUp"){
                this.scene.activeCamera.position.z -= 0.25;
            }
            if(action === "key_down_ArrowLeft"){
                this.scene.activeCamera.position.x += 0.25;
            }
            if(action == "key_down_ArrowRight"){
                this.scene.activeCamera.position.x -= 0.25;
            }
            // console.warn(this.scene.activeCamera.position);

        }
    );
};

App.prototype.newGame = function(){
    this.goToMap(MAPS_ID.INTRO);
    this.guiManager.showLayout(LAYOUTS_UI.MAP, false);
}

App.prototype.goToMainMenu = async function(MAP_ID){
    alert('TO DO: go to main menu)))');
}

App.prototype.goToMap = async function(MAP_ID){
    console.log(`Load map   ---   ${MAP_ID}`);
    const meta = MAPS_META[MAP_ID];
    const nav_base64 = await this.resourceLoader.getFile(meta.NAVIGATION, meta.CHUNK, {format: "base64", prefix:"data:;base64,"});
    const map_options = {
        navigation: nav_base64,
    };
    await this.loadLevelToWASM?.(map_options);
    this.showDebugNavMap?.();
    
}
App.prototype.leaveMap = function(){

}
App.prototype.uiHandler = function(type, detail){
    const handler = this.uiEventHandlers?.[type];
    if (handler) {
        handler.call(this, detail);
    } else {
        console.warn(`Unhandled UI event type: ${type}`, detail);
    }
}