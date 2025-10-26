import { LayoutUI } from "../../LayoutUI";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Ellipse } from "@babylonjs/gui/2D/controls/ellipse";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Observer } from "@babylonjs/core/Misc/observable";
import { Container } from "@babylonjs/gui";

const JOYSTICK_BACKGROUND_COLOR = "#333333BB";
const JOYSTICK_THUMB_COLOR = "#AAAAAAEE";   
const BUTTON_COLOR = "#007BFFBB";        
const BUTTON_PRESSED_COLOR = "#0056BB";    

export function VirtualControlsLayout(ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener, inputManager) {
    LayoutUI.call(this, ADTexture, resourceLoader, polylang, gameDataManager, uiCommandsListener);
    this.inputManager = inputManager;

    this.joystick = null;
    this.joystickThumb = null;
    this.joystickBackground = null;
    this.joystickPointerId = -1;
    this.joystickMaxDistance = 80;
    this.joystickDeadZone = 10;
    this.joystickContainer = null;

    this.joystickInitialX = 0;
    this.joystickInitialY = 0;
    this.joystickTouchAreaHorizontalShare = 0.5;

    this.jumpButton = null;
    this.attackButton = null;

    this.isInit = false;
    this._joystickMoveObserver = null;
    this._joystickUpObserver = null;
    this._globalPointerDownObserver = null;
    this.joystick_size = 300;
}

VirtualControlsLayout.prototype = Object.create(LayoutUI.prototype);
VirtualControlsLayout.prototype.constructor = VirtualControlsLayout;

VirtualControlsLayout.prototype.create = async function() {
    this.container.name = "virtual_controls_container";
    this.container.height = "100%";
    this.container.width = "100%";
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.container.isHitTestVisible = false;
    this.joystickContainer = new Container("joystickContainer");
    this.joystickContainer.width = `${this.joystick_size}px`;
    this.joystickContainer.height = `${this.joystick_size}px`;
    this.joystickContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.joystickContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.joystickContainer.isVisible = false;

    this.container.addControl(this.joystickContainer);

    this.joystickBackground = new Ellipse("joystickBackground");
    this.joystickBackground.width = "150px";
    this.joystickBackground.height = "150px";
    this.joystickBackground.color = "green";
    this.joystickBackground.thickness = 2;
    this.joystickBackground.background = JOYSTICK_BACKGROUND_COLOR;
    this.joystickBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.joystickBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.joystickContainer.addControl(this.joystickBackground);

    this.joystickThumb = new Ellipse("joystickThumb");
    this.joystickThumb.width = "80px";
    this.joystickThumb.height = "80px";
    this.joystickThumb.color = "white";
    this.joystickThumb.thickness = 2;
    this.joystickThumb.background = JOYSTICK_THUMB_COLOR;
    this.joystickThumb.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.joystickThumb.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.joystickContainer.addControl(this.joystickThumb);

    this._setupJoystickEvents();
{
    this.jumpButton = Button.CreateSimpleButton("jumpButton", "JUMP");
    this.jumpButton.width = "120px";
    this.jumpButton.height = "120px";
    this.jumpButton.cornerRadius = 60;
    this.jumpButton.background = BUTTON_COLOR;
    this.jumpButton.color = "white";
    this.jumpButton.fontSize = 28;
    this.jumpButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.jumpButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.jumpButton.left = "-150px";
    this.jumpButton.top = "-20px";
    this.container.addControl(this.jumpButton);
    this._setupButtonEvents(this.jumpButton, "jump");

    this.attackButton = Button.CreateSimpleButton("attackButton", "ATTACK");
    this.attackButton.width = "120px";
    this.attackButton.height = "120px";
    this.attackButton.cornerRadius = 60;
    this.attackButton.background = BUTTON_COLOR;
    this.attackButton.color = "white";
    this.attackButton.fontSize = 28;
    this.attackButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.attackButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.attackButton.left = "-20px";
    this.attackButton.top = "-150px";
    this.container.addControl(this.attackButton);
    this._setupButtonEvents(this.attackButton, "attack");

    this.isInit = true;
    this.container.isVisible = false;

}
};

VirtualControlsLayout.prototype._setupJoystickEvents = function() {
    this.joystickBackground.isPointerBlocker = true;
    this.joystickThumb.isPointerBlocker = false;

    let isJoystickActive = false;

    this._globalPointerDownObserver = this.inputManager.onPointerDownObservable.add((event) => {
        const canvas = this.ADTexture.getScene().getEngine().getRenderingCanvas();
        const canvasRect = canvas.getBoundingClientRect();

        const adtRenderWidth = this.ADTexture.getSize().width;
        const adtRenderHeight = this.ADTexture.getSize().height;

        let idealWidth = this.ADTexture.idealWidth;
        let idealHeight = this.ADTexture.idealHeight;
        if (idealHeight && !idealWidth) {
            idealWidth = adtRenderWidth * (idealHeight / adtRenderHeight);
        } else if (!idealHeight && idealWidth) {
            idealHeight = adtRenderHeight * (idealWidth / adtRenderWidth);
        } else if (!idealHeight && !idealWidth) {
            idealWidth = adtRenderWidth;
            idealHeight = adtRenderHeight;
        }
        const scaleX = idealWidth / adtRenderWidth;
        const scaleY = idealHeight / adtRenderHeight;
        const clientXRelativeToCanvas = event.clientX - canvasRect.left;
        const clientYRelativeToCanvas = event.clientY - canvasRect.top;
        const idealClientX = clientXRelativeToCanvas * scaleX;
        const idealClientY = clientYRelativeToCanvas * scaleY;
        const screenWidthForAreaCheck = adtRenderWidth; 

        if (this.joystickPointerId === -1 && event.clientX < screenWidthForAreaCheck * this.joystickTouchAreaHorizontalShare) {
            isJoystickActive = true;
            this.joystickPointerId = event.pointerId;

            this.joystickInitialX = idealClientX;
            this.joystickInitialY = idealClientY;
            this.joystickContainer.left = `${idealClientX - this.joystick_size / 2}px`;
            this.joystickContainer.top = `${idealClientY - this.joystick_size / 2}px`;
            this.joystickContainer.isVisible = true;
            this.joystickThumb.left = 0;
            this.joystickThumb.top = 0;

            this._joystickMoveObserver = this.inputManager.onMoveObservable.add((moveInfo) => {
                if (isJoystickActive && moveInfo.action === "pointer_move" && moveInfo.event.pointerId === this.joystickPointerId) {
                    const currentCanvas = this.ADTexture.getScene().getEngine().getRenderingCanvas();
                    const currentCanvasRect = currentCanvas.getBoundingClientRect();

                    const currentClientXRelativeToCanvas = moveInfo.event.clientX - currentCanvasRect.left;
                    const currentClientYRelativeToCanvas = moveInfo.event.clientY - currentCanvasRect.top;
                    
                    let currentPointerPos = new Vector2(
                        currentClientXRelativeToCanvas * scaleX,
                        currentClientYRelativeToCanvas * scaleY
                    );
                    
                    let delta = currentPointerPos.subtract(new Vector2(this.joystickInitialX, this.joystickInitialY)); // Дельта в идеальных координатах

                    if (delta.length() > this.joystickMaxDistance) {
                        delta.normalize().scaleInPlace(this.joystickMaxDistance);
                    }

                    this.joystickThumb.left = delta.x;
                    this.joystickThumb.top = delta.y;

                    let moveVector = Vector2.Zero();
                    if (delta.length() > this.joystickDeadZone) {
                        moveVector.x = delta.x / this.joystickMaxDistance;
                        moveVector.y = -delta.y / this.joystickMaxDistance;
                    }
                    this.inputManager.onMoveObservable.notifyObservers({ direction: moveVector, action: "joystick_move" });
                }
            });
            this.observers.push(this._joystickMoveObserver);

            this._joystickUpObserver = this.inputManager.onPointerUpObservable.add((event) => {
                if (isJoystickActive && event.pointerId === this.joystickPointerId) {
                    isJoystickActive = false;
                    this.joystickPointerId = -1;
                    this.joystickThumb.left = 0;
                    this.joystickThumb.top = 0;
                    this.joystickContainer.isVisible = false;
                    this.inputManager.onMoveObservable.notifyObservers({ direction: Vector2.Zero(), action: "joystick_stop" });

                    if (this._joystickMoveObserver) {
                        this.inputManager.onMoveObservable.remove(this._joystickMoveObserver);
                        this.observers = this.observers.filter(obs => obs !== this._joystickMoveObserver);
                        this._joystickMoveObserver = null;
                    }
                    if (this._joystickUpObserver) {
                        this.inputManager.onPointerUpObservable.remove(this._joystickUpObserver);
                        this.observers = this.observers.filter(obs => obs !== this._joystickUpObserver);
                        this._joystickUpObserver = null;
                    }
                }
            });
            this.observers.push(this._joystickUpObserver);
        }
    });
    this.observers.push(this._globalPointerDownObserver);
};

VirtualControlsLayout.prototype._setupButtonEvents = function(button, actionName) {
    button.onPointerDownObservable.add(() => {
        button.background = BUTTON_PRESSED_COLOR;
        this.inputManager.onActionTriggeredObservable.notifyObservers({ action: actionName, value: true });
    });
    button.onPointerUpObservable.add(() => {
        button.background = BUTTON_COLOR;
        this.inputManager.onActionTriggeredObservable.notifyObservers({ action: actionName, value: false });
    });
    button.onPointerOutObservable.add((pointerInfo) => {
        if (pointerInfo.event && pointerInfo.event.buttons === 0 && button.background === BUTTON_PRESSED_COLOR) {
            button.background = BUTTON_COLOR;
            this.inputManager.onActionTriggeredObservable.notifyObservers({ action: actionName, value: false });
        }
    });
};

VirtualControlsLayout.prototype.resize = function() {
    if (this.isInit) {


    }
};

VirtualControlsLayout.prototype.dispose = function() {
    LayoutUI.prototype.dispose.call(this);

    if (this._globalPointerDownObserver) {
        this.inputManager.onPointerDownObservable.remove(this._globalPointerDownObserver);
        this._globalPointerDownObserver = null;
    }
    if (this._joystickMoveObserver) {
        this.inputManager.onMoveObservable.remove(this._joystickMoveObserver);
        this._joystickMoveObserver = null;
    }
    if (this._joystickUpObserver) {
        this.inputManager.onPointerUpObservable.remove(this._joystickUpObserver);
        this._joystickUpObserver = null;
    }

    this.container.dispose();
    this.joystickBackground?.dispose();
    this.joystickThumb?.dispose();
    this.joystickContainer?.dispose();
    this.jumpButton?.dispose();
    this.attackButton?.dispose();
};
