import { UI_EVENTS } from "../consts/ui_const";

export const AppUIEventsMixin = {};

AppUIEventsMixin.uiEventsInit = function() {
  let app = this;
  this.uiEventHandlers = {};
  this.uiEventHandlers[UI_EVENTS.CHANGE_LANG] = this._changeLang.bind(app);
  this.uiEventHandlers[UI_EVENTS.NEW_GAME] = this._newGameRequest;
  this.uiEventHandlers[UI_EVENTS.TOGGLE_PAUSE] = this._togglePause;
  this.uiEventHandlers[UI_EVENTS.GO_TO_MAIN_MENU] = this._goToMainMenu;
};

AppUIEventsMixin._changeLang = function(detail){
  this.polylang.lang = detail.lang;
  this.guiManager.changeLang();
};

AppUIEventsMixin._newGameRequest = function(detail){
    console.log("Начата новая игра!", detail);
    this.newGame?.();
};

AppUIEventsMixin._togglePause = function() {
    this.gameDataManager.setPauseStatus(!this.gameDataManager.isGamePaused());
};
AppUIEventsMixin._goToMainMenu = function() {
    this.goToMainMenu?.();
};