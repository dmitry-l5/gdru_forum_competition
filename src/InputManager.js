import { Observable } from "@babylonjs/core/Misc/observable";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";
import { ActionManager, ExecuteCodeAction } from "@babylonjs/core/Actions";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";

export function InputManager(scene, canvas) {
    this.scene = scene;
    this.canvas = canvas;

    this.onMoveObservable = new Observable();
    this.onActionTriggeredObservable = new Observable();
    this.onPointerDownObservable = new Observable();
    this.onPointerUpObservable = new Observable();
    this.onPointerClickObservable = new Observable();

    this._pressedKeys = {
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false
    };

    this._setupKeyboardInput();
    this._setupPointerInput();
    this._setupMouseLook();
}

InputManager.prototype = Object.create(null);
InputManager.prototype.constructor = InputManager;

InputManager.prototype._setupKeyboardInput = function() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
        const keyCode = kbInfo.event.code;
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                this.onActionTriggeredObservable.notifyObservers({
                    action: `key_down_${keyCode}`,
                    value: true,
                    event: kbInfo.event
                });

                if (this._pressedKeys.hasOwnProperty(keyCode)) {
                    this._pressedKeys[keyCode] = true;
                    this.onMoveObservable.notifyObservers({
                        action: "keyboard_move",
                        direction: this._getKeyboardMoveDirection(),
                        event: kbInfo.event
                    });
                }
                if (keyCode === "Space") { 
                    this.onActionTriggeredObservable.notifyObservers({ action: "jump", value: true, event: kbInfo.event });
                }
                // if (keyCode === "Escape") { /* ... */ }
                // if (keyCode === "KeyI") { /* ... */ }
                break;

            case KeyboardEventTypes.KEYUP:
                this.onActionTriggeredObservable.notifyObservers({
                    action: `key_up_${keyCode}`,
                    value: false,
                    event: kbInfo.event
                });

                if (this._pressedKeys.hasOwnProperty(keyCode)) {
                    this._pressedKeys[keyCode] = false;
                    this.onMoveObservable.notifyObservers({
                        action: "keyboard_move",
                        direction: this._getKeyboardMoveDirection(),
                        event: kbInfo.event
                    });
                }

                if (keyCode === "Space") {
                    this.onActionTriggeredObservable.notifyObservers({ action: "jump", value: false, event: kbInfo.event });
                }
                // if (keyCode === "Escape") { /* ... */ }
                // if (keyCode === "KeyI") { /* ... */ }
                break;
        }
    });
};

InputManager.prototype._getKeyboardMoveDirection = function() {
    let x = 0;
    let y = 0;

    if (this._pressedKeys.KeyW) {
        y += 1;
    }
    if (this._pressedKeys.KeyS) {
        y -= 1;
    }
    if (this._pressedKeys.KeyA) {
        x -= 1;
    }
    if (this._pressedKeys.KeyD) {
        x += 1;
    }

    let direction = new Vector2(x, y);
    if (direction.length() > 1) {
        direction.normalize();
    }
    return direction;
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

};


InputManager.prototype.dispose = function() {
    this.onMoveObservable.clear();
    this.onActionTriggeredObservable.clear();
    this.onPointerDownObservable.clear();
    this.onPointerUpObservable.clear();
    console.log("InputManager disposed.");
};
