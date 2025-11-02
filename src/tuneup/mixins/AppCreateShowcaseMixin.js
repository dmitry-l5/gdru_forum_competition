import { AppendSceneAsync, ArcRotateCamera, Camera, HemisphericLight, ImportMeshAsync, LoadAssetContainerAsync, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { UI_EVENTS } from "../ui/ui_const";
import { LAYOUTS_UI } from "../ui/ui_const";
import { LayoutUI } from "../../LayoutUI";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { ResourceLoader } from "../../ResourceLoader";
import { MODELS_ID, MODELS_META, RESOURCE_TYPE } from "../resource_const";
import { AppUI } from "../../AppUI";
import { MainTeamLayout } from "../ui/team_menus/MainTeamLayout";
import { FirstHeroSelectLayout } from "../ui/team_menus/FirstHeroSelectLayout";
import { UNITS_ID, UNITS_META } from "../units/units_const";
import { TEAM_SLOTS } from "../teams_const";
import { Inspector } from "@babylonjs/inspector";

export const AppCreateShowcaseMixin = {
  resourceLoader: new ResourceLoader(),
    showcase : {
      firstSelectedHero:null,
      slots:{
        [TEAM_SLOTS.MAIN]:null,
        [TEAM_SLOTS.SECOND]:null,
        [TEAM_SLOTS.THIRD]:null,
      },
      ui:null,
      scene:null,
      hallModelInstance:null,
      teamSelectCamera:null,
      containers:{},
      loadContainers:()=>{},
      buildHero:()=>{
        
      },
      getContainer(id, type){
        if(this.containers[id]){
          return Promise.resolve(this.containers[id]);
        }
        let meta, ext;
        switch (type) {
          case RESOURCE_TYPE.UNIT:
            meta = MODELS_META[UNITS_META[id]?.MODEL_ID];
            ext = '.glb';
            break;
          case RESOURCE_TYPE.MODEL:
          default:
              meta = MODELS_META[id];
              ext = '.glb';
            break;
        }
        if (!meta) {
            return Promise.reject(new Error(`Model metadata not found for ID: ${id}`));
        }
        return new Promise((resolve, reject)=>{
          AppCreateShowcaseMixin.resourceLoader.getFile(meta.PATH, meta.CHUNK ).then((buffer)=>{
            LoadAssetContainerAsync(buffer, this.scene,  {
              pluginExtension: ext,
              pluginOptions:{
                gltf:{
                  extensionOptions:{
                    ExtrasAsMetadata:{enabled:true}
                  }
                }
              }
            }).then((container)=>{
              container.animationGroups.every((item=>item.stop()));
              this.containers[id] = container;
              resolve(this.containers[id]);
            });
          })
        });
      },
      replaceHero(UNIT, SLOT){
        if(this.slots[SLOT] != null){
          this.slots[SLOT].dispose();
          this.slots[SLOT] = null;
        }
        AppCreateShowcaseMixin.setSelectedHero(UNIT);
        if(Object.values(UNITS_ID).includes(UNIT) && UNITS_META[UNIT]){
          this.getContainer(UNIT, RESOURCE_TYPE.UNIT).then((container)=>{
            const root = this.slots[SLOT] = container.instantiateModelsToScene();
            const rootMesh = root.rootNodes[0];
            const containerNode = this.scene.getNodeByName(SLOT); 
            if (containerNode) {
              rootMesh.parent = containerNode;
              rootMesh.position = Vector3.Zero(); 
              rootMesh.rotation = Vector3.Zero();
            }
          });
        }
      },
    },
};
AppCreateShowcaseMixin.setSelectedHero = function(hero_id){
  this.showcase.firstSelectedHero = hero_id;
}
AppCreateShowcaseMixin.createShowcase = async function(engine) {
  const meta = this.resourceLoader.getModelMeta(MODELS_ID.SETUP_TEAM_SCENE);
  const raw_model = await this.resourceLoader.getFile(meta.PATH, meta.CHUNK);
  let app = this;
  const scene = this.showcase.scene = new Scene(this.engine);
  await AppendSceneAsync( raw_model, scene, {pluginExtension: '.glb'});
  this.showcase.ADTexture = AdvancedDynamicTexture.CreateFullscreenUI("showcase_ui", true, scene);
  this.showcase.ui = new AppUI(this.showcase.ADTexture, this.resourceLoader, this.polylang, this.gameDataManager, null/*this.inputManager*/, this);

  this.showcase.ui.createUI = function(){
      let resourceLoader = this.resourceLoader;
      this.layouts[LAYOUTS_UI.MAIN] = new MainTeamLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app));
      this.layouts[LAYOUTS_UI.MAIN].create();
      this.layouts[LAYOUTS_UI.FIRST_HERO] = new FirstHeroSelectLayout(this.ADTexture, resourceLoader, this.polylang, this.gameDataManager, this.app.uiHandler.bind(this.app));
      this.layouts[LAYOUTS_UI.FIRST_HERO].create();
      this.showLayout();
      return this;
  }
  this.showcase.ui.createUI();
  const cam_pos = scene.getNodeByName('team_camera');
  const light = new HemisphericLight('HM_Light', new Vector3(0,5,2.5), scene )
  const camera = new ArcRotateCamera('showcase_camera', 5, 5, 10, new Vector3(0,0,0), scene);
  camera.position = cam_pos.position.clone();
  camera.setTarget(scene.getNodeByName('team_camera_target'));
  // camera.attachControl();

  // this.reloadTeamScreen();
  return scene;
};

AppCreateShowcaseMixin.loadHeroesToContainers = function(){
  
}

AppCreateShowcaseMixin.reloadTeamScreen = function(){
  const slots = this.showcase.slots;
  for (const slotKey in slots) {
    if (slots.hasOwnProperty(slotKey)) {
        const item = slots[slotKey];
        
        if (item != null) {
            item.dispose();
            slots[slotKey] = null;
        }
    }
  }
  this.gameDataManager.firstSelectedHero = null;
  if(!this.gameDataManager.startCharSelected){
    this.showcase.ui.showLayout(LAYOUTS_UI.FIRST_HERO, false);
  }else{
    this.showcase.ui.showLayout(LAYOUTS_UI.MAIN, false);
  }
}

AppCreateShowcaseMixin._setupUI = function(){
  const adt = new AdvancedDynamicTexture('showcase_ui');
  const ui = new LayoutUI(adt,this.resourceLoader, this.polylang, this.dataManager, this.uiCommandsListener);
  // ui.layout
}
