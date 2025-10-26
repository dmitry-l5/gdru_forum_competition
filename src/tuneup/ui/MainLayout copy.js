import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { LayoutUI } from "../../LayoutUI";
import { TextBlock } from "@babylonjs/gui";
import { TEXT_KEYS } from "../local/keys_const";
import { LANGS } from "../common_const";


export function MainLayout(ADTexture, resourceLoader, polylang, gameData, uiHandler){
    this.gameData = gameData;
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameData, uiHandler);
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
    }
}
MainLayout.prototype = Object.create(LayoutUI.prototype);
MainLayout.prototype.constructor = MainLayout;
MainLayout.prototype.create = async function(){
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;;
    this.container.background = "transparent";
    const start_menu = this.createStartMenu();
    this.container.addControl(start_menu);
    this.update();


    
    let observer;
    observer = this.gameDataManager.playerStatsManager.onHealthChanged.add((newHealth) => {
        if (this.items.healthBar) {
            this.items.healthBar.width = `${newHealth}%`;
            this.items.healthBar.background = newHealth > 50 ? "green" : (newHealth > 20 ? "orange" : "red");
        }
    });
    this.observers.push(observer);
    observer = this.gameDataManager.playerStatsManager.onExperienceGained.add((currentExp) => {
        if (this.items.experienceText) {
            this.items.experienceText.text = `XP: ${currentExp}`;
        }
    });
    this.observers.push(observer);

    observer = this.gameDataManager.playerStatsManager.onLevelUp.add((newLevel) => {
        if (this.items.levelText) {
            this.items.levelText.text = `Level: ${newLevel}`;
        }
        this.app.ui.showNotification(`Поздравляем! Вы достигли уровня ${newLevel}!`);
    });
    this.observers.push(observer);
}

MainLayout.prototype.createStartMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    container.background = 'green';
    container.width = '900px';
    container.height = '900px';

    const text = new TextBlock('title', 'This is title');
    text.top = '-300px';
    text.width = '500px';
    text.height = '75px';
    this.registerText( TEXT_KEYS.MAIN_MENU_TITLE, text );
    const new_game_btn = Button.CreateSimpleButton('new_game_btn', 'new_game_btn');
    this.registerText( TEXT_KEYS.NEW_GAME, new_game_btn.textBlock );
    new_game_btn.top = '-100px';
    new_game_btn.width = '500px';
    new_game_btn.height = '75px';
    const continue_game_btn = Button.CreateImageButton('continue_game_btn', 'continue_game_btn');
    this.registerText( TEXT_KEYS.CONTINUE_GAME, continue_game_btn.textBlock );
    continue_game_btn.top = '0px';
    continue_game_btn.width = '500px';
    continue_game_btn.height = '75px';
    const change_lang_btn = Button.CreateImageButton('change_lang_btn', 'change_lang_btn');
    change_lang_btn.top = '-200px';
    change_lang_btn.width = '500px';
    change_lang_btn.height = '75px';
    change_lang_btn.onPointerClickObservable.add(()=>{
        let lang;
        if(this.polylang.lang === LANGS.RU){
            lang = LANGS.EN;
        }else{
            lang = LANGS.RU;
        }
        this.listener?.(
            'change_lang', 
            {
                lang: lang
            }
        );
    });

    container.addControl(new_game_btn);
    container.addControl(continue_game_btn);
    container.addControl(change_lang_btn);
    container.addControl(text);
    return container;
}


MainLayout.prototype.resize = function(size = 1){
    return;
    this.items.neso_btn.height = `${128*size}px`;
    this.items.neso_btn.width = `${128*size}px`;
}



MainLayout.prototype.update = function(){
    if( this.items.sound_en_btn )
        this.items.sound_en_btn.isVisible = !this.app.userSoundEnabled;
    if( this.items.sound_dis_btn )
        this.items.sound_dis_btn.isVisible = this.app.userSoundEnabled;
}
