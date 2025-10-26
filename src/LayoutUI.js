import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Container } from "@babylonjs/gui/2D/controls/container";
import { RES_CHUNKS } from "./tuneup/resource_const";


export function LayoutUI(ADTexture, resourceLoader, polylang, gameData, uiCommandsListener){
    this.ADTexture = ADTexture;
    this.resourceLoader = resourceLoader;
    this.polylang = polylang;
    this.gameDataManager = gameData;
    this.uiCommandsListener = uiCommandsListener;
    this.container = new Container();
    this.ADTexture.addControl(this.container);
    this.translatableText = {};
    this.isInit = false;
    this.observers = []; 

}
LayoutUI.prototype = Object.create(null);
LayoutUI.prototype.constructor = LayoutUI;
LayoutUI.prototype.create = function(){
    //virtual method
}

LayoutUI.prototype.getResource = async function(path, chunk = RES_CHUNKS.REQUIRED) {
    try {
        return await this.resourceLoader.getFile(path, chunk, { format: 'base64' });
    } catch (error) {
        throw error;
    }
}

LayoutUI.prototype.getTexture = async function(path, chunk = RES_CHUNKS.REQUIRED) {
    try {
        const base64_str = await this.getResource(path, chunk);
        return new Texture(`data:image/png;base64,${base64_str}`, null, true, true, Texture.NEAREST_SAMPLINGMODE, null, null, null, false, Texture.RGBFormat);
    } catch (error) {
        // console.error(`Не удалось загрузить текстуру UI по пути: ${path} из чанка ${chunk}. Ошибка:`, error);
        return null;
    }
}

LayoutUI.prototype.registerText = function(KEY, textBlockInstance){
    if (textBlockInstance && typeof textBlockInstance.text !== 'undefined') {
        this.translatableText[KEY] = textBlockInstance;
    } else {
        console.warn('Attempted to register a non-text block or invalid instance for translation:', textBlockInstance);
    }
}

LayoutUI.prototype.changeLang = function(LANG){
    for(let key in this.translatableText){
        if (this.translatableText.hasOwnProperty(key)) {
            const textBlock = this.translatableText[key];           
            textBlock.text = this.polylang.t(key);
        }
    }
}
// LayoutUI.prototype.registeruiHandler = function(callback){
//     this.uiHandler = callback;
// }