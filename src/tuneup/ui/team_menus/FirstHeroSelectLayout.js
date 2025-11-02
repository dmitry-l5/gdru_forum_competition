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
    container.background = 'black';

    return container;
}

FirstHeroSelectLayout.prototype._createHeroButton = function(heroId) {
    const container_btn = Button.CreateSimpleButton("hero_btn_" + heroId, UNITS_ID[heroId] || heroId);
    container_btn.width = '240px';
    container_btn.height = '240px';
    container_btn.color = "white";
    container_btn.cornerRadius = 20;
    container_btn.background = 'blue';
    container_btn.onPointerClickObservable.add(()=>{
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
    container.background = 'green';
    container.width = '100%'; 
    container.height = '250px';
    const numHeroes = this.startHeroes.length;
    const buttonWidth = 240;
    const spacing = 40;
    const totalItemWidth = buttonWidth + spacing;
    const totalSelectorWidth = numHeroes * totalItemWidth - spacing;
    let currentLeftOffset = -(totalSelectorWidth / 2) + (buttonWidth / 2);
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