import { TEAM_SLOTS } from "../../teams_const";
import { LAYOUTS_UI, UI_EVENTS } from "../../ui/ui_const";

export const CommonEventsMixin = {};
CommonEventsMixin.HANDLERS_MAP = {
  [UI_EVENTS.MAIN_MENU]: '_goToMainMenu',
  [UI_EVENTS.CHANGE_LANG]: '_changeLang',
  [UI_EVENTS.NEW_GAME]: '_newGameRequest',
  [UI_EVENTS.GO_TO_MAP]: '_goToMap',
  // [UI_EVENTS.TOGGLE_PAUSE]: '_togglePause',
  [UI_EVENTS.OPEN_MANAGEMENT_SCREEN]: '_showTeamManagementUI',
  [UI_EVENTS.SELECT_FIRST_HERO]: '_selectFirstHero',
  [UI_EVENTS.SELECT_FIRST_HERO_CONFIRM]: '_selectFirstHeroConfirm',
  [UI_EVENTS.DEBUG_DATASET]: '_debugDataset',
  //on the map
  [UI_EVENTS.HERO_BUTTON]: '_mapHeroButton',

};

CommonEventsMixin._changeLang = function(detail){
  this.polylang.lang = detail.lang;
  this.ui.changeLang();
  this.showcase?.ui.changeLang();
};

CommonEventsMixin._newGameRequest = function(detail){
    console.log("Начата новая игра!", detail);
    this.newGame?.();
};

CommonEventsMixin._togglePause = function() {
    this.gameDataManager.setPauseStatus(!this.gameDataManager.isGamePaused()); 
};
CommonEventsMixin._showTeamManagementUI = function(){
  this.teamManagement();
  this.ui.showLayout(LAYOUTS_UI.MANAGEMENT, false);
}
CommonEventsMixin._selectFirstHero = function(options){
  const {unit_id} = options;
  this.showcase?.replaceHero(unit_id, TEAM_SLOTS.MAIN);
}
CommonEventsMixin._selectFirstHeroConfirm = function(options){
  const {unit_id = null} = options;
  this.gameDataManager.startCharSelected = true;
  this.gameDataManager.setCharacterToSlot(unit_id, TEAM_SLOTS.MAIN);

  this.showcase?.ui?.showLayout?.(LAYOUTS_UI.MAIN, false);
}
CommonEventsMixin._goToMainMenu = function(options){
  this.goToMainMenu();
}
CommonEventsMixin._goToMap = function(options){
  this.goToMap();
}
CommonEventsMixin._debugDataset = function(options){
  const {index} = options;
  const success = this.gameDataManager.initDevDataset(index);
  if(success)
    this.goToMap();
  else
    alert('404');
}

CommonEventsMixin._mapHeroButton = function(options){
  console.warn(options);
  
}
