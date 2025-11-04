import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { InputText, Rectangle, TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../../LayoutUI";
import { TEXT_KEYS } from "../local/keys_const";
import { LANGS } from "../common_const";
import { UI_COLORS, UI_EVENTS } from "./ui_const";

export function MainLayout(ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener) {
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener);
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
        scoreText: null,
        healthBar: null,
        devModeIndex:null,
    };
}
MainLayout.prototype = Object.create(LayoutUI.prototype);
MainLayout.prototype.constructor = MainLayout;

MainLayout.prototype.create = async function() {
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    // this.container.isHitTestVisible = false;
    const start_menu = this.createStartMenu();
    this.container.addControl(start_menu);
    this.isInit = true;
    return this.container;
};

MainLayout.prototype.createStartMenu = function(size = 1){
    const container = new Container('start_menu');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    // container.background = UI_COLORS.BACKGROUND_DARK;
    container.width = '900px';
    container.height = '900px';
    container.cornerRadius = 20;

    const backplate = new Rectangle('backplate');
    backplate.width  = '100%';
    backplate.height = '100%';

    backplate.background = UI_COLORS.BACKGROUND_DARK;
    backplate.color = UI_COLORS.BUTTON_BORDER;
    backplate.cornerRadius = 10000;

    const text = new TextBlock('title', this.polylang.t(TEXT_KEYS.GREETING));
    text.top = '-250px';
    text.width = '750px';
    text.height = '100px';
    // text.background = UI_COLORS.BACKGROUND_DARK;
    text.fontSize = 36;
    this.registerText( TEXT_KEYS.GREETING, text );

    const new_game_btn = Button.CreateSimpleButton('new_game_btn', this.polylang.t(TEXT_KEYS.NEW_GAME));
    this.registerText( TEXT_KEYS.NEW_GAME, new_game_btn.textBlock );
    new_game_btn.top = '-100px';
    new_game_btn.width = '500px';
    new_game_btn.height = '75px';

    new_game_btn.cornerRadius = 20;
    new_game_btn.textBlock.fontSize = 36;
    new_game_btn.background = UI_COLORS.BUTTON_DEFAULT;
    new_game_btn.color = UI_COLORS.BUTTON_BORDER;
    new_game_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    new_game_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    new_game_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});
    new_game_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.NEW_GAME,
            {}
        );
    });

    const continue_game_btn = Button.CreateSimpleButton('continue_game_btn', this.polylang.t(TEXT_KEYS.CONTINUE_GAME));
    this.registerText( TEXT_KEYS.CONTINUE_GAME, continue_game_btn.textBlock );
    continue_game_btn.top = '0px';
    continue_game_btn.width = '500px';
    continue_game_btn.height = '75px';

    continue_game_btn.cornerRadius = 20;
    continue_game_btn.textBlock.fontSize = 36;
    continue_game_btn.background = UI_COLORS.BUTTON_DEFAULT;
    continue_game_btn.color = UI_COLORS.BUTTON_BORDER;
    continue_game_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    continue_game_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    continue_game_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});
    continue_game_btn.onPointerClickObservable.add(()=>{
        alert(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi modi suscipit odit illo iste ut vel minima, voluptate voluptatem ratione a repellat iure sapiente, eligendi, at provident! Reiciendis, dolorum ea.'
        )
    });

    
    const dev_mode_btn = Button.CreateSimpleButton('dev_mode_btn', 'DEV MODE');
    dev_mode_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    dev_mode_btn.top = '100px';
    dev_mode_btn.left = '-100px';
    dev_mode_btn.width = '300px';
    dev_mode_btn.height = '75px';
    dev_mode_btn.cornerRadius = 20;
    dev_mode_btn.textBlock.fontSize = 36;
    dev_mode_btn.background = UI_COLORS.ACCENT_SECONDARY;
    dev_mode_btn.color = UI_COLORS.BUTTON_BORDER;
    dev_mode_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    dev_mode_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.ACCENT_PRIMARY});
    dev_mode_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.ACCENT_SECONDARY});
    dev_mode_btn.onPointerClickObservable.add(()=>{
        const i = parseInt(this.items.devModeIndex.text)
        if(i){
            this.uiCommandsListener?.(
                UI_EVENTS.DEBUG_DATASET,
                {index:i}
            );
        }else{
              alert('uncorrect index');
        }
    });





    const dataset_index_wrapper = new Rectangle('dataset_index_wrapper');
    dataset_index_wrapper.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    dataset_index_wrapper.top = '100px';
    dataset_index_wrapper.left = '175px';
    dataset_index_wrapper.width = '150px';
    dataset_index_wrapper.height = '75px';
    
    dataset_index_wrapper.cornerRadius = 20;
    // dataset_index_wrapper.thickness = 3;
    dataset_index_wrapper.background = UI_COLORS.ACCENT_SECONDARY;
    dataset_index_wrapper.color = UI_COLORS.BUTTON_BORDER;
    dataset_index_wrapper.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.ACCENT_PRIMARY});
    dataset_index_wrapper.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.ACCENT_SECONDARY});
    //
    
    const dataset_index = new InputText('dataset_index');
    // dataset_index.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.items.devModeIndex = dataset_index;
    dataset_index.name = 'dataset_index_input';
    dataset_index.width = 0.95;
    dataset_index.height = 0.95;
    dataset_index.text = '1';
    dataset_index.color = UI_COLORS.BUTTON_TEXT;
    dataset_index.background = 'transparent';
    // dataset_index.background = 'green';
    dataset_index.thickness = 0;
    dataset_index.fontSize = 36;
    dataset_index.focusedBackground = 'transparent';
    dataset_index.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    console.log(dataset_index.textBlock);
    this.centerInputText(dataset_index);
    dataset_index.onTextChangedObservable.add(() => this.centerInputText(dataset_index));
    dataset_index_wrapper.addControl(dataset_index);



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
    change_lang_btn.top = '200px';
    change_lang_btn.width = '500px';
    change_lang_btn.height = '75px';

    change_lang_btn.cornerRadius = 20;
    change_lang_btn.textBlock.fontSize = 36;
    change_lang_btn.background = UI_COLORS.BUTTON_DEFAULT;
    change_lang_btn.color = UI_COLORS.BUTTON_BORDER;
    change_lang_btn.textBlock.color = UI_COLORS.BUTTON_TEXT;
    change_lang_btn.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    change_lang_btn.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});

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

    backplate.addControl(dataset_index_wrapper);
    backplate.addControl(dev_mode_btn);

    backplate.addControl(continue_game_btn);
    backplate.addControl(change_lang_btn);
    backplate.addControl(new_game_btn);
    // backplate.addControl(management_btn);
    backplate.addControl(text);
    container.addControl(backplate);
    return container;
}