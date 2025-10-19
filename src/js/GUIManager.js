import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { LAYOUTS_UI } from "./consts/ui_const";
import { InputManager } from "./InputManager";
import { MainMenuLayout } from "./ui/MainMenuLayout";
import { LayoutUI } from "./LayoutUI";
import { MapLayout } from "./ui/MapLayout";


export function GUIManager(app, options){
    const {ADTexture = null, resourceLoader, polylang, gameDataManager, inputManager} = options;
    this.app = app;
    this.ADTexture = ADTexture;
    this.resourceLoader = resourceLoader;
    this.polylang = polylang;
    this.gameDataManager = gameDataManager;
    this.inputManager = inputManager;

    this.layouts ={
        [LAYOUTS_UI.MAIN_MENU] : null,
    };

    this._setupInputHandlers();
}
GUIManager.prototype = Object.create(null);
GUIManager.prototype.constructor = GUIManager;

GUIManager.prototype._setupInputHandlers = function() {
    if(this.inputManager instanceof InputManager){
            this.inputManager.onActionTriggeredObservable.add((actionInfo) => {
            if (actionInfo.action === "toggle_pause" && actionInfo.value === true) {
                this.app.uiHandler(UI_EVENTS.TOGGLE_PAUSE);
                console.log("UI: Toggle Pause via InputManager");
            }
            // if (actionInfo.action === "toggle_inventory" && actionInfo.value === true) {
            //     this.app.uiHandler(UI_EVENTS.TOGGLE_INVENTORY);
            // }
            // if (actionInfo.action === "toggle_lang" && actionInfo.value === true) {
            //     const newLang = this.polylang.lang === LANGS.RU ? LANGS.EN : LANGS.RU;
            //     this.app.uiHandler(UI_EVENTS.CHANGE_LANG, { lang: newLang });
            // }
        });
    }
};

GUIManager.prototype.init = function(){
    let app = this.app;
    let resourceLoader = this.resourceLoader;
    if(!this.ADTexture) this.ADTexture = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, app.scene);
    const ADTexture = this.ADTexture;
    ADTexture.idealHeight = 1000;
    this.layouts[LAYOUTS_UI.MAIN_MENU] = new MainMenuLayout(this.ADTexture, { resourceLoader:resourceLoader, polylang:this.polylang, gameDataManager:this.gameDataManager, uiCommandsListener:this.app.uiHandler.bind(this.app) });
    this.layouts[LAYOUTS_UI.MAIN_MENU].create();
    // this.layouts[LAYOUTS_UI.CONTROL] = new VirtualControlsLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app), this.inputManager);
    // this.layouts[LAYOUTS_UI.CONTROL].create();
    this.layouts[LAYOUTS_UI.MAP] = new MapLayout(this.ADTexture, { resourceLoader:resourceLoader, polylang:this.polylang, gameDataManager:this.gameDataManager, uiCommandsListener:this.app.uiHandler.bind(this.app) });
    this.layouts[LAYOUTS_UI.MAP].create();
    this.showLayout();
    return this;
}
GUIManager.prototype.resize = function(){
   let size = this.ADTexture.getSize();
   this.ADTexture.update();
    Object.values(this.layouts).forEach(element => {
        if(element.isInit === true)
        element.resize?.(size);
    });
}
GUIManager.prototype.showLayout = function( layoutUI_const = null, additionalMode = true){
    if(!additionalMode){
        for( let layout in this.layouts ){
            if( this.layouts[layout] instanceof LayoutUI){
                this.layouts[layout].container.isVisible = false;
            }
        }
    }
    if( !( this.layouts[layoutUI_const] instanceof LayoutUI ) ){
        return null;
    }
    this.layouts[layoutUI_const].setDefault?.();
    this.layouts[layoutUI_const].container.isVisible = true;
    return this.layouts[layoutUI_const];
}
GUIManager.prototype.changeLang = function(lang){
    Object.values(this.layouts).forEach((item, key)=>{ 
        item.changeLang?.();});
}