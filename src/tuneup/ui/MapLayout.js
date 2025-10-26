import { Button } from "@babylonjs/gui/2D/controls/button";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { LayoutUI } from "../../LayoutUI";
import { TextBlock } from "@babylonjs/gui";
import { TEXT_KEYS } from "../local/keys_const";
import { LANGS } from "../common_const";

export function MapLayout(ADTexture, resourceLoader, polylang, gameData, uiHandler){
    this.gameData = gameData;
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameData, uiHandler);
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
    this.container.addControl(exit_btn);
    this.update();
}

MapLayout.prototype.createExitButton = function(){
    const close_btn = Button.CreateSimpleButton('exit', this.polylang.t(TEXT_KEYS.EXIT))
    this.registerText( TEXT_KEYS.EXIT, close_btn.textBlock );
    close_btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    close_btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    close_btn.left = '-150px';
    close_btn.top = '0px';
    close_btn.width = '100px';
    close_btn.height = '50px';
    return close_btn;
}

MapLayout.prototype.resize = function(size = 1){
    return;
}

MapLayout.prototype.update = function(){
    return;
}