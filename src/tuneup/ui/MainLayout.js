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


    let observer;

    observer = this.gameDataManager.playerStatsManager.onHealthChanged.add((newHealth) => {
        if (this.items.healthBar) {
            this.items.healthBar.width = `${newHealth}%`;
            this.items.healthBar.background = newHealth > 50 ? "blue" : (newHealth > 20 ? "orange" : "red");
        }
    });
    this.observers.push(observer);

    observer = this.gameDataManager.playerStatsManager.onScoreChanged.add((newScore) => {
        if (this.items.scoreText) {
            this.items.scoreText.text = `Score: ${newScore}`;
        }
    });
    this.observers.push(observer);




    this.container.addControl(start_menu);
    this.isInit = true;
    return this.container;
};

MainLayout.prototype.createStartMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    container.background = 'green';
    container.width = '900px';
    container.height = '900px';

    const scoreText = new TextBlock();
    scoreText.text = `Score: ${this.gameDataManager.playerStatsManager.getScore()}`; 
    scoreText.color = "white";
    scoreText.fontSize = 72;
    scoreText.top = "300px";
    scoreText.left = "0px";
    scoreText.width = '500px';
    scoreText.height = '75px';
    this.items.scoreText = scoreText;
    container.addControl(scoreText);

    const healthBarContainer = new Container();
    healthBarContainer.width = "400px";
    healthBarContainer.height = "30px";
    healthBarContainer.background = "gray";
    healthBarContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    healthBarContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    healthBarContainer.top = "10px";
    this.container.addControl(healthBarContainer);

    const healthBar = new Container();
    healthBar.width = `${this.gameDataManager.playerStatsManager.getHealth()}%`;
    healthBar.height = "100%";
    healthBar.background = "purple";
    healthBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.items.healthBar = healthBar;
    healthBarContainer.addControl(healthBar);

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
    new_game_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.NEW_GAME,
            {}
        );
    });

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
    container.addControl(text);
    return container;
}