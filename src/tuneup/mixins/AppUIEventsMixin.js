import { TEAM_SLOTS } from "../teams_const";
import { UI_EVENTS } from "../ui/ui_const";
import { LAYOUTS_UI } from "../ui/ui_const";
import { AppMapEventsMixin } from "./AppUIEventsMixin/AppMapEventsMixin";
import { CommonEventsMixin } from "./AppUIEventsMixin/CommonEventsMixin";
import { MainMenuEventsMixin } from "./AppUIEventsMixin/MainMenuEventsMixin";


export const AppUIEventsMixin = {};

Object.assign( AppUIEventsMixin,
  MainMenuEventsMixin,
  CommonEventsMixin,
  AppMapEventsMixin
);

AppUIEventsMixin.uiEventsInit = function() {
  this.uiEventHandlers = {};
  this._registerEvents(MainMenuEventsMixin.HANDLERS_MAP);
  this._registerEvents(CommonEventsMixin.HANDLERS_MAP);
  this._registerEvents(AppMapEventsMixin.HANDLERS_MAP);
}
AppUIEventsMixin._registerEvents = function(events){
  for(const [eventType, handlerName] of Object.entries(events)){
    const handler = this[handlerName];
    if(handler){
      this.uiEventHandlers[eventType] = handler.bind(this);
    }else {
      console.error(`Handler ${handlerName} not found for event ${eventType}`);
    }
  }
}