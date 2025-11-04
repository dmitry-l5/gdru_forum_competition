import { TEAM_SLOTS } from "../teams_const";
import { UI_EVENTS } from "../ui/ui_const";
import { LAYOUTS_UI } from "../ui/ui_const";

export const AppUIEventsMixin = {};

AppUIEventsMixin.uiEventsInit = function() {
  let app = this;
  this.uiEventHandlers = {};
  this.uiEventHandlers[UI_EVENTS.MAIN_MENU] = this._goToMainMenu;
  this.uiEventHandlers[UI_EVENTS.CHANGE_LANG] = this._changeLang.bind(app);
  this.uiEventHandlers[UI_EVENTS.NEW_GAME] = this._newGameRequest;
  this.uiEventHandlers[UI_EVENTS.GO_TO_MAP] = this._goToMap;
  // this.uiEventHandlers[UI_EVENTS.TOGGLE_PAUSE] = this._togglePause;
  this.uiEventHandlers[UI_EVENTS.OPEN_MANAGEMENT_SCREEN] = this._showTeamManagementUI;
  this.uiEventHandlers[UI_EVENTS.SELECT_FIRST_HERO] = this._select_first_hero;
  this.uiEventHandlers[UI_EVENTS.SELECT_FIRST_HERO_CONFIRM] = this._select_first_hero_confirm;
  this.uiEventHandlers[UI_EVENTS.DEBUG_DATASET] = this._debug_dataset;
};

AppUIEventsMixin._changeLang = function(detail){
  this.polylang.lang = detail.lang;
  this.ui.changeLang();
  this.showcase?.ui.changeLang();
};

AppUIEventsMixin._newGameRequest = function(detail){
    console.log("Начата новая игра!", detail);
    this.newGame?.();
};

AppUIEventsMixin._togglePause = function() {
    this.gameDataManager.setPauseStatus(!this.gameDataManager.isGamePaused()); 
};
AppUIEventsMixin._showTeamManagementUI = function(){
  this.teamManagement();
  this.ui.showLayout(LAYOUTS_UI.MANAGEMENT, false);
}
AppUIEventsMixin._select_first_hero = function(options){
  const {unit_id} = options;
  this.showcase?.replaceHero(unit_id, TEAM_SLOTS.MAIN);
}
AppUIEventsMixin._select_first_hero_confirm = function(options){
  const {unit_id = null} = options;
  this.gameDataManager.startCharSelected = true;
  this.gameDataManager.setCharacterToSlot(unit_id, TEAM_SLOTS.MAIN);

  this.showcase?.ui?.showLayout?.(LAYOUTS_UI.MAIN, false);
}
AppUIEventsMixin._goToMainMenu = function(options){
  this.goToMainMenu();
}
AppUIEventsMixin._goToMap = function(options){
  this.goToMap();
}
AppUIEventsMixin._debug_dataset = function(options){
  const {index} = options;
  const success = this.gameDataManager.initDevDataset(index);
  if(success)
    this.goToMap();
  else
    alert('404');
}
