import { BaseApp } from "../BaseApp";

export function MapEditor(canvas, options){
    BaseApp.call(canvas, options);

}
MapEditor.prototype = Object.create(BaseApp.prototype);
MapEditor.prototype.constructor = Map;

