import { TEAM_SLOTS } from "../../teams_const";
import { LAYOUTS_UI, UI_EVENTS } from "../../ui/ui_const";

export const AppMapEventsMixin = {};
AppMapEventsMixin.HANDLERS_MAP = {
  [UI_EVENTS.HERO_BUTTON]: '_mapHeroButton',

};

AppMapEventsMixin._mapHeroButton = function(options){
  const {slot_id} = options;
  console.warn(slot_id);
  this.world.playground.selectUnitFromSlot(slot_id);
}
