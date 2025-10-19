// InputManager.js
import { Observable } from "@babylonjs/core/Misc/observable";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";
import { ActionManager, ExecuteCodeAction } from "@babylonjs/core/Actions"; 
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { KEY_MAP } from "./consts/key_map_const";

export function InputManager(scene, canvas) {
    this.scene = scene;
    this.canvas = canvas;

    this.onMoveObservable = new Observable();
    this.onActionTriggeredObservable = new Observable();
    this.onPointerDownObservable = new Observable();
    this.onPointerUpObservable = new Observable();
    this.onPointerClickObservable = new Observable();
    this.onKeyboardObservable = new Observable(); 

    this.keyMap = KEY_MAP;
    this.inputPtr = null;
    this.inputView = null;

    this._setupKeyboardInput();
    this._setupPointerInput();
    this._setupMouseLook();
}

InputManager.prototype = Object.create(null);
InputManager.prototype.constructor = InputManager;

InputManager.prototype.setSharedInputMapPtr = function(buffer, mem_ptr){
    this.inputPtr = mem_ptr;
    this.inputView = new Int32Array(buffer, mem_ptr, 4); 
}

InputManager.prototype._setupKeyboardInput = function() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
        const { type, event } = kbInfo;
        const keyCode = event.code;
        const isKeyDown = type === KeyboardEventTypes.KEYDOWN; 
        this.onKeyboardObservable.notifyObservers(kbInfo);
        if (type !== KeyboardEventTypes.KEYDOWN && type !== KeyboardEventTypes.KEYUP) {
            return;
        }
        this.setWasmKeyState(keyCode, isKeyDown);
        const actionName = isKeyDown ? `key_down_${keyCode}` : `key_up_${keyCode}`;
        this.onActionTriggeredObservable.notifyObservers({
            action: actionName,
            value: isKeyDown,
            event: event
        });
        
        // if (keyCode === "Space") {
        //     this.onActionTriggeredObservable.notifyObservers({ 
        //         action: "jump", 
        //         value: isKeyDown, 
        //         event: event 
        //     });
        // }
    });
};
InputManager.prototype.setWasmKeyState = function(keyCode, isDown) {
    if (keyCode in this.keyMap && this.inputView) {
        const index = this.keyMap[keyCode];
        this.inputView[index] = isDown ? 1 : 0; 
    }
};

InputManager.prototype._setupPointerInput = function() {
    this.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                this.onPointerDownObservable.notifyObservers(pointerInfo.event);
                break;
            case PointerEventTypes.POINTERUP:
                this.onPointerUpObservable.notifyObservers(pointerInfo.event); 
                break;
            case PointerEventTypes.POINTERMOVE:
                this.onMoveObservable.notifyObservers({
                    action: "pointer_move",
                    deltaX: pointerInfo.event.movementX,
                    deltaY: pointerInfo.event.movementY,
                    event: pointerInfo.event
                });
                break;
            case PointerEventTypes.POINTERWHEEL:
                this.onActionTriggeredObservable.notifyObservers({ action: "scroll_wheel", delta: pointerInfo.event.deltaY, event: pointerInfo.event });
                break;
            case PointerEventTypes.POINTERTAP:
                const pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                if (pickResult.hit) {
                    this.onPointerClickObservable.notifyObservers(pickResult.pickedPoint);
                }
                break;
      
        }
    });
};

InputManager.prototype._setupMouseLook = function() {
    // ...
};


InputManager.prototype.dispose = function() {
    this.onMoveObservable.clear();
    this.onActionTriggeredObservable.clear();
    this.onPointerDownObservable.clear();
    this.onPointerUpObservable.clear();
    this.onKeyboardObservable.clear();
    console.log("InputManager disposed.");
};