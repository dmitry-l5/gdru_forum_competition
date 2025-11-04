import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../../../LayoutUI";
import { TEXT_KEYS } from "../../local/keys_const";
import { LANGS } from "../../common_const";
import { UI_COLORS, UI_EVENTS } from "../ui_const";

export function MainTeamLayout(ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener) {
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener);
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
        scoreText: null,
        healthBar: null,
    };
}
MainTeamLayout.prototype = Object.create(LayoutUI.prototype);
MainTeamLayout.prototype.constructor = MainTeamLayout;

MainTeamLayout.prototype.create = async function() {
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    // this.container.isHitTestVisible = false;
    const back_or_continue = this.createAppNavigationMenu();

    this.container.addControl(back_or_continue);
    this.isInit = true;
    return this.container;
};

MainTeamLayout.prototype.createAppNavigationMenu = function(size = 1){
    const container = new Container('nav_app');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    container.width = '600px';
    container.height = '250px';
    // container.background = UI_COLORS.BACKGROUND_SEMI_DARK;
    
    const go_to_map_btn = Button.CreateSimpleButton('go_to_map', this.polylang.t(TEXT_KEYS.GO_TO_MAP_BTN))
    this.registerText( TEXT_KEYS.GO_TO_MAP_BTN, go_to_map_btn.textBlock);
    go_to_map_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    go_to_map_btn.width = '250px';
    go_to_map_btn.height = '200px';
    go_to_map_btn.left = '-33px';
    go_to_map_btn.top = '0px';
    go_to_map_btn.cornerRadius = 20;
    go_to_map_btn.textBlock.fontSize = 36;
    go_to_map_btn.background = UI_COLORS.BUTTON_DEFAULT;
    go_to_map_btn.color = UI_COLORS.BUTTON_BORDER;
    go_to_map_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    go_to_map_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    go_to_map_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});
    go_to_map_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
        UI_EVENTS.GO_TO_MAP,
            {}
        );
    })
    
    
    container.addControl(go_to_map_btn);
    const go_to_main_btn = Button.CreateSimpleButton('go_to_main', this.polylang.t(TEXT_KEYS.GO_TO_MAIN_MENU_BTN))
    this.registerText( TEXT_KEYS.GO_TO_MAIN_MENU_BTN, go_to_main_btn.textBlock);
    
    go_to_main_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    go_to_main_btn.width = '250px';
    go_to_main_btn.height = '200px';
    go_to_main_btn.cornerRadius = 20;
    go_to_main_btn.left = '33px';
    go_to_main_btn.top = '0px';
    go_to_main_btn.textBlock.fontSize = 36;
    go_to_main_btn.background = UI_COLORS.BUTTON_DEFAULT;;
    go_to_main_btn.color = UI_COLORS.BUTTON_BORDER;
    go_to_main_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    go_to_main_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    go_to_main_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});
    go_to_main_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
        UI_EVENTS.MAIN_MENU,
            {}
        );
    })
    container.addControl(go_to_main_btn);


    return container;
}