import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { TextBlock } from "@babylonjs/gui";
import { LayoutUI } from "../../../LayoutUI";
import { TEXT_KEYS } from "../../local/keys_const";
import { LANGS } from "../../common_const";
import { UI_EVENTS } from "../ui_const";
import { UNITS_ID } from "../../units/units_const";

export function FirstHeroSelectLayout(ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener) {
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener);
    this.startHeroes = this.gameDataManager.getStartHeroes();
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
        scoreText: null,
        healthBar: null,
        hero_buttons: {},
    };
    this.heroBtnSize = 200;
}
FirstHeroSelectLayout.prototype = Object.create(LayoutUI.prototype);
FirstHeroSelectLayout.prototype.constructor = FirstHeroSelectLayout;

FirstHeroSelectLayout.prototype.create = async function() {
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.container.isHitTestVisible = false;
    const confirm_panel = this.createConfirmPanel();
    const select_hero_menu = this.createHeroSelector();
    this.container.addControl(select_hero_menu);
    this.container.addControl(confirm_panel);
    this.isInit = true;
    return this.container;
};

FirstHeroSelectLayout.prototype.createConfirmPanel = function(){
    const container = new Container('confirm_panel');
    container.horizontalAlignment = Container.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Container.VERTICAL_ALIGNMENT_TOP;
    container.height = '150px';
    container.width = '100%';
    container.background = 'transparent';

    
    const text = new TextBlock('select_your_hero_text', "Выбери своего первого персонажа")
    text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    text.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    text.width = '50%'
    text.height = '100%'
    text.fontSize = 48;
    text.left = 0;
    text.top = 0;
    text.color = 'blue';
    text.background = '#eaee00ffff'
    container.addControl(text);

    const confirm_btn = Button.CreateSimpleButton('confirm_first_hero', 'Подтвердить');
    confirm_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    confirm_btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
    confirm_btn.width = '300px';
    confirm_btn.height = '100px';
    confirm_btn.background = 'yellow';
    confirm_btn.cornerRadius = 20;
    confirm_btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.SELECT_FIRST_HERO_CONFIRM,
            {unit_id: this.gameDataManager.firstSelectedHero}
        )
    });
    container.addControl(confirm_btn);

    return container;
}

FirstHeroSelectLayout.prototype._createHeroButton = function(heroId) {
    const container_btn = Button.CreateSimpleButton("hero_btn_" + heroId, UNITS_ID[heroId] || heroId);
    container_btn.width  = this.heroBtnSize+"px";
    container_btn.height = this.heroBtnSize+"px";
    container_btn.color = "white";
    container_btn.cornerRadius = 20;
    container_btn.background = 'blue';
    container_btn.onPointerClickObservable.add(()=>{
        this.gameDataManager.firstSelectedHero = heroId;
        this.uiCommandsListener?.(
            UI_EVENTS.SELECT_FIRST_HERO,
            {unit_id: heroId}
        )
    });




    const textBlock = container_btn.getChildByName("hero_btn_" + heroId + "_label");
    if (textBlock instanceof TextBlock) {
        textBlock.text = UNITS_ID[heroId] || heroId; 
        textBlock.fontSize = 30;
    }

    this.items.hero_buttons[heroId] = container_btn;
    return container_btn;
};

FirstHeroSelectLayout.prototype.createHeroSelector = function(){
    const container = new Container('hero_selector');
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    container.background = '#ffffff00';
    container.width = '700px'; 
    container.height = '210px';
    const numHeroes = this.startHeroes.length;
    const buttonWidth = 240;
    const spacing = 40;
    const totalItemWidth = this.heroBtnSize + spacing;
    const totalSelectorWidth = numHeroes * totalItemWidth - spacing;
    let currentLeftOffset = -(totalSelectorWidth / 2) + (this.heroBtnSize / 2);
    this.startHeroes.forEach(heroId => {
        const heroButton = this._createHeroButton(heroId);
        heroButton.left = `${currentLeftOffset}px`;
        heroButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        heroButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        container.addControl(heroButton);
        currentLeftOffset += totalItemWidth;
    });

    return container;
}