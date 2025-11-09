import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { LayoutUI } from "../../LayoutUI";
import { TextBlock } from "@babylonjs/gui";
import { TEXT_KEYS } from "../local/keys_const";
import { LANGS } from "../common_const";
import { LayoutStylingMixin } from "./LayoutStylingMixin";
import { TEAM_SLOTS } from "../teams_const";
import { UI_EVENTS } from "./ui_const";
import { prototype } from "jszip";

export function MapLayout(ADTexture, resourceLoader, polylang, gameData, uiHandler){
    this.gameData = gameData;
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameData, uiHandler);
    Object.assign(this, LayoutStylingMixin);
    this.items = {
        play_button: null,
        sound_en_btn: null,
        sound_dis_btn: null,
    }
}

MapLayout.prototype = Object.create(LayoutUI.prototype);
MapLayout.prototype.constructor = MapLayout;
MapLayout.prototype.create = async function(){
    this.container.height = '100%';
    this.container.width = '100%';
    this.container.isHitTestVisible = false;
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;;
    this.container.background = "transparent";
    const exit_btn = this.createExitButton();
    const heroes_panel = this.createHeroesPanel();
    this.container.addControl(heroes_panel);
    this.container.addControl(exit_btn);
    this.update();
}

MapLayout.prototype.createExitButton = function(){
    const close_btn = Button.CreateSimpleButton('exit', this.polylang.t(TEXT_KEYS.EXIT))
    this.registerText( TEXT_KEYS.EXIT, close_btn.textBlock );
    close_btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    close_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.defaultButtonStyling(close_btn, {left: '-250px', top:'10px', width:'250px', height:'72px'});
    return close_btn;
}
MapLayout.prototype.createHeroesPanel = function(){
    const container = new Container('heroes_panel');
    const size_btn = 150;
    let index = 0;
    let btn;
    Object.entries(TEAM_SLOTS).forEach(([value, key])=>{
        btn = this.createHeroButton( value, key, size_btn);
        btn.top = (size_btn*index + 10)+'px';
        index++;
        container.addControl(btn);

    });
    container.height = '100%';
    container.width = `${size_btn+10}px`
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    container.background = 'purple';
    

    return container;
}

MapLayout.prototype.createHeroButton = function(title, id, size = 50){
    const btn = Button.CreateSimpleButton(id, title);
    btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.defaultButtonStyling(btn, {left: '0px', width: `${size}px`, height:`${size}px`});
    btn.textBlock.fontSize = 24;

    btn.onPointerClickObservable.add(()=>{
        this.uiCommandsListener?.(
            UI_EVENTS.HERO_BUTTON,
            {slot_id: id}
        )
    });

    return btn;
}
MapLayout.prototype.resize = function(size = 1){
    return;
}

MapLayout.prototype.update = function(){
    return;
}
MapLayout.prototype.createUnitMenus = function(units_meta){

}

MapLayout.prototype.createUnitMenu = function(){
    
}
MapLayout.prototype.openUnitMenu = function(){

}