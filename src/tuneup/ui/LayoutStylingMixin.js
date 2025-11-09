import { Button, Control } from "@babylonjs/gui"
import { UI_COLORS } from "./ui_const";

export const LayoutStylingMixin = {} 

LayoutStylingMixin.defaultButtonStyling = function(button, options = {}){
    const {left, top, width, height} = options
    if(!(button instanceof Button)){
        throw new Error("Styling default button fail");
        return;
    }
    const keys = ['left', 'top', 'width', 'height'];
    const validProps = keys.reduce((acc, key) => {
        if (options[key] !== undefined) {
            acc[key] = options[key];
        }
        return acc;
    }, {});

    Object.assign(button, validProps);
    button.cornerRadius = 20;
    button.textBlock.fontSize = 36;
    button.background = UI_COLORS.BUTTON_DEFAULT;
    button.color = UI_COLORS.BUTTON_BORDER;
    button.textBlock.color = UI_COLORS.BUTTON_TEXT;
    button.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.BUTTON_HOVER});
    button.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.BUTTON_DEFAULT});

}
// LayoutStylingMixin.defaultButtonStyling = function(button){
//     if(!(button instanceof Button)){
//         throw new Error("Styling default button fail");
//         return;
//     }
//     button.cornerRadius = 20;
//     button.textBlock.fontSize = 36;
//     button.background = UI_COLORS.ACCENT_SECONDARY;
//     button.color = UI_COLORS.BUTTON_BORDER;
//     button.textBlock.color = UI_COLORS.BUTTON_TEXT;
//     button.onPointerEnterObservable.add((item)=>{item.background = UI_COLORS.ACCENT_PRIMARY});
//     button.onPointerOutObservable.add((item)=>{item.background = UI_COLORS.ACCENT_SECONDARY});
// }