import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../LayoutUI";
import { TEXT_KEYS } from "../locals/keys_const";
import { LANGS } from "../consts/common_const";
import { UI_EVENTS } from "../consts/ui_const";

export function MainMenuLayout(ADTexture, options = {}) {
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
MainMenuLayout.prototype = Object.create(LayoutUI.prototype);
MainMenuLayout.prototype.constructor = MainMenuLayout;

MainMenuLayout.prototype.create = async function() {
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.container.isHitTestVisible = false;
    const start_menu = this.createStartMenu();
    this.container.addControl(start_menu);
    this.isInit = true;
    return this.container;
};

MainMenuLayout.prototype.createStartMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    container.background = 'red';
    container.width = '900px';
    container.height = '900px';
    const new_game_btn = Button.CreateSimpleButton('new_game_btn', this.polylang.t(TEXT_KEYS.NEW_GAME) );
    this.registerText( TEXT_KEYS.NEW_GAME, new_game_btn.textBlock );
    new_game_btn.fontSize = "30px";
    new_game_btn.color = "white";
    new_game_btn.background = "green";
    new_game_btn.top = '-100px';
    new_game_btn.width = '500px';
    new_game_btn.height = '75px';
    new_game_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.NEW_GAME,
            {}
        );
    });

    container.addControl(new_game_btn);
    // container.addControl(continue_game_btn);
    // container.addControl(change_lang_btn);
    // container.addControl(text);
    return container;
}