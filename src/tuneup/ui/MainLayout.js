import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../../LayoutUI";
import { TEXT_KEYS } from "../local/keys_const";
import { LANGS } from "../common_const";
import { UI_EVENTS } from "./ui_const";

export function MainLayout(ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener) {
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener);
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
        scoreText: null,
        healthBar: null,
    };
}
MainLayout.prototype = Object.create(LayoutUI.prototype);
MainLayout.prototype.constructor = MainLayout;

MainLayout.prototype.create = async function() {
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

MainLayout.prototype.createStartMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    container.background = '#00ff6a79';
    container.width = '900px';
    container.height = '900px';
    container.cornerRadius = 20;


    const text = new TextBlock('title', this.polylang.t(TEXT_KEYS.GREETING));
    text.top = '-350px';
    text.width = '90%';
    text.height = '300px';
    this.registerText( TEXT_KEYS.GREETING, text );

    const new_game_btn = Button.CreateSimpleButton('new_game_btn', this.polylang.t(TEXT_KEYS.NEW_GAME));
    this.registerText( TEXT_KEYS.NEW_GAME, new_game_btn.textBlock );
    new_game_btn.top = '-200px';
    new_game_btn.width = '500px';
    new_game_btn.height = '75px';
    new_game_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.NEW_GAME,
            {}
        );
    });

    const continue_game_btn = Button.CreateSimpleButton('continue_game_btn', this.polylang.t(TEXT_KEYS.CONTINUE_GAME));
    this.registerText( TEXT_KEYS.CONTINUE_GAME, continue_game_btn.textBlock );
    continue_game_btn.top = '-100px';
    continue_game_btn.width = '500px';
    continue_game_btn.height = '75px';
    // continue_game_btn.image.width = '0%';
    // continue_game_btn.image.height = '0%';
    // continue_game_btn.textBlock.width = '100%';
    // continue_game_btn.textBlock.height = '100%';
    // continue_game_btn.textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    // continue_game_btn.textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    // const management_btn = Button.CreateSimpleButton('management_btn', this.polylang.t(TEXT_KEYS.CONTINUE_GAME));
    // this.registerText( TEXT_KEYS.CONTINUE_GAME, management_btn.textBlock );
    // management_btn.top = '150px';
    // management_btn.width = '500px';
    // management_btn.height = '75px';
    // management_btn.onPointerClickObservable.add(()=>{
    //     this.uiCommandsListener?.(
    //         UI_EVENTS.OPEN_MANAGEMENT_SCREEN,
    //         {}
    //     )
    // });

    const change_lang_btn = Button.CreateSimpleButton('change_lang_btn', 'Язык / Language');
    change_lang_btn.top = '300px';
    change_lang_btn.width = '500px';
    change_lang_btn.height = '75px';
    change_lang_btn.onPointerClickObservable.add(()=>{
        let lang;
        if(this.polylang.lang === LANGS.RU){
            lang = LANGS.EN;
        }else{
            lang = LANGS.RU;
        }
        this.uiCommandsListener?.(
            UI_EVENTS.CHANGE_LANG, 
            {
                lang: lang
            }
        );
    });

    container.addControl(new_game_btn);
    container.addControl(continue_game_btn);
    container.addControl(change_lang_btn);
    // container.addControl(management_btn);
    container.addControl(text);
    return container;
}