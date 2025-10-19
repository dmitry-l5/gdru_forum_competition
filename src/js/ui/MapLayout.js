import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../LayoutUI";
import { TEXT_KEYS } from "../locals/keys_const";
import { LANGS } from "../consts/common_const";
import { UI_EVENTS } from "../consts/ui_const";

export function MapLayout(ADTexture, options = {}) {
    const { resourceLoader, polylang, gameDataManager, uiCommandsListener } = options;
    LayoutUI.call(this, ADTexture, {resourceLoader, polylang, gameDataManager, uiCommandsListener });
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
        scoreText: null,
        healthBar: null,
    };
}
MapLayout.prototype = Object.create(LayoutUI.prototype);
MapLayout.prototype.constructor = MapLayout;

MapLayout.prototype.create = async function() {
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.container.isHitTestVisible = false;
    const top_menu = this.createTopMenu();
    this.container.addControl(top_menu);
    this.isInit = true;
    return this.container;
};

MapLayout.prototype.createTopMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    container.background = 'transparent';
    container.width = '100%';
    container.height = '100px';
    const close_btn = Button.CreateSimpleButton('close_btn', this.polylang.t(TEXT_KEYS.EXIT) );
    this.registerText( TEXT_KEYS.EXIT, close_btn.textBlock );
    close_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    close_btn.fontSize = "30px";
    close_btn.color = "white";
    close_btn.background = "green";
    close_btn.top = '-0';
    close_btn.width = '100px';
    close_btn.height = '100px';
    close_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.GO_TO_MAIN_MENU,
            {}
        );
    });
    container.addControl(close_btn);
    return container;
}