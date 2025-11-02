import { TEAM_SLOTS } from "../teams_const";
import { UI_EVENTS } from "../ui/ui_const";
import { LAYOUTS_UI } from "../ui/ui_const";

export const AppUIEventsMixin = {};

AppUIEventsMixin.uiEventsInit = function() {
  let app = this;
  this.uiEventHandlers = {};
  this.uiEventHandlers[UI_EVENTS.CHANGE_LANG] = this._changeLang.bind(app);
  this.uiEventHandlers[UI_EVENTS.NEW_GAME] = this._newGameRequest;
  // this.uiEventHandlers[UI_EVENTS.TOGGLE_PAUSE] = this._togglePause;
  this.uiEventHandlers[UI_EVENTS.OPEN_MANAGEMENT_SCREEN] = this._showTeamManagementUI;
  this.uiEventHandlers[UI_EVENTS.SELECT_FIRST_HERO] = this._select_first_hero;
  this.uiEventHandlers[UI_EVENTS.SELECT_FIRST_HERO_CONFIRM] = this._select_first_hero_confirm;
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
    this.gameDataManager.setPauseStatus(!this.gameDataManager.isGamePaused()); // gameDataManager - свойство App
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
  this.showcase?.ui?.showLayout?.(LAYOUTS_UI.MAIN, false);
}
