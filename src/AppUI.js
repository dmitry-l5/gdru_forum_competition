import { LayoutUI } from "./LayoutUI";
import { MainLayout } from "./tuneup/ui/MainLayout";
import { MapLayout } from "./tuneup/ui/MapLayout";
import { VirtualControlsLayout } from "./tuneup/ui/VirtualControlsLayout";
import { LAYOUTS_UI } from "./tuneup/ui_const";

export function AppUI(ADTexture, resourceLoader, polylang, gameDataManager, inputManager, app){
    this.app = app;
    this.ADTexture = ADTexture;
    this.resourceLoader = resourceLoader;
    this.polylang = polylang;
    this.gameDataManager = gameDataManager;
    this.inputManager = inputManager;

    ADTexture.idealHeight = 1000;

    this.layouts ={
        [LAYOUTS_UI.MAIN] : null,
    };

    this._setupInputHandlers();
}
AppUI.prototype = Object.create(null);
AppUI.prototype.constructor = AppUI;

AppUI.prototype._setupInputHandlers = function() {
    this.inputManager.onActionTriggeredObservable.add((actionInfo) => {
        if (actionInfo.action === "toggle_pause" && actionInfo.value === true) {
            this.app.uiHandler(UI_EVENTS.TOGGLE_PAUSE);
            console.log("UI: Toggle Pause via InputManager");
        }
    });
};

AppUI.prototype.createUI = function(){
    let app = this.app;
    let resourceLoader = this.resourceLoader;

    this.layouts[LAYOUTS_UI.MAIN] = new MainLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app));
    this.layouts[LAYOUTS_UI.MAIN].create();
    // this.layouts[LAYOUTS_UI.CONTROL] = new VirtualControlsLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app), this.inputManager);
    // this.layouts[LAYOUTS_UI.CONTROL].create();
    this.layouts[LAYOUTS_UI.MAP] = new MapLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app));
    this.layouts[LAYOUTS_UI.MAP].create();
    // this.layouts[LAYOUTS_UI.MAIN].registerListener( this.app.uiHandler.bind(this.app));

    // this.layouts[LAYOUTS_UI.PLAYGROUND] = new PlaygroundLayout(this.ADTexture, resourceLoader, app);
    // this.layouts[LAYOUTS_UI.PLAYGROUND].create();

    // this.layouts[LAYOUTS_UI.PLAYER_SETUP] = new EquipLayout(this.ADTexture, resourceLoader, app);
    // this.layouts[LAYOUTS_UI.PLAYER_SETUP].create();

    // this.layouts[LAYOUTS_UI.COMPLETE] = new CompleteLayout(this.ADTexture, resourceLoader, app);
    // this.layouts[LAYOUTS_UI.COMPLETE].create();

    // Если используете OperationsLayout, обновите и его
    // this.layouts[LAYOUTS_UI.OPERATIONS] = new OperationsLayout(this.ADTexture, resourceLoader, app);
    // this.layouts[LAYOUTS_UI.OPERATIONS].create();
    this.showLayout();
    return this;
}
AppUI.prototype.resize = function(){
   let size = this.ADTexture.getSize();
   
   this.ADTexture.update();
    Object.values(this.layouts).forEach(element => {
        if(element.isInit === true)
        element.resize?.(size);
    });
}
AppUI.prototype.showLayout = function( layoutUI_const = null, additionalMode = true){
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
AppUI.prototype.changeLang = function(lang){
    Object.values(this.layouts).forEach((item, key)=>{ 
        item.changeLang?.();});
}