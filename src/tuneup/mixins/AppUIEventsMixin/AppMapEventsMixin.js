import { TEAM_SLOTS } from "../../teams_const";
import { LAYOUTS_UI, UI_EVENTS } from "../../ui/ui_const";

export const AppMapEventsMixin = {};
AppMapEventsMixin.HANDLERS_MAP = {
  [UI_EVENTS.HERO_TOGGLE_SELECT]: '_mapHeroToggleButton',
  [UI_EVENTS.HERO_SINGLE_SELECT]: '_mapHeroButton',
  [UI_EVENTS.HERO_ADD_SELECT]: '_mapAddHeroSelect',
  [UI_EVENTS.HERO_REMOVE_SELECT]: '_mapRemoveHeroSelect',
  [UI_EVENTS.UPDATE_TEAM_DATA]: '_updateTeamData',

};

AppMapEventsMixin._mapHeroButton = function(options){
  const {slot_id} = options;
  this.world.playground.selecAddtUnit(slot_id);
  // this.world.playground.selectSingleUnit(slot_id);
}
AppMapEventsMixin._mapAddHeroSelect = function(options){
  const {slot_id} = options;
  this.world.playground.selecAddtUnit(slot_id);
}
AppMapEventsMixin._mapRemoveHeroSelect = function(options){
  const {slot_id} = options;
  this.world.playground.selectRemoveUnit(slot_id);
}
AppMapEventsMixin._updateTeamData = function(options){
  const {data} = options;
  const layout = this.ui.layouts[LAYOUTS_UI.MAP];
  if(layout && typeof layout.updateTeamPanel === 'function'){
    layout.updateTeamPanel(data); 
  }
};

AppMapEventsMixin._mapHeroToggleButton = function(options){
  const {slot_id} = options;
  this.world.playground.selectToggleUnit(slot_id);
}

