import { Camera } from "@babylonjs/core/Cameras/camera";
import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Vector2 } from "@babylonjs/core/Maths/math.vector"; 

// import { UniversalCamera } from "@babylonjs/core";

export function CamerasManager(inputManager, app){
    this.app = app;
    this.inputManager = inputManager; 
    this.defaultCamera = new TargetCamera("camera_default", new Vector3(10, 15, 10), this.app.scene);
    this.defaultCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this.defaultCamera.setTarget(Vector3.Zero());
    this.TARGET_HEIGHT_UNITS = 40;
    this.defaultCamera.attachControl(this.app.canvas, true);
    this._updateOrthographicCamera();

    this.lock = false
    this.target = null;
    this.rotationSensitivity = 0.00;
    this.swipeAreaHorizontalShare = 0.5; 

    this._setupInputHandlers();

    this.beforeRender = this.app.scene.onBeforeRenderObservable.add(()=>{
        if(!this.lock || !(this.target instanceof TransformNode) ){
            return;
        }
        let deltaTime = this.app.engine.getDeltaTime() / 1000;
        let position = Vector3.Lerp(this.defaultCamera.target, this.target.absolutePosition, this.transitionSpeed*Math.min(deltaTime * 2, 1));
        this.defaultCamera.setTarget(position);
    });
}

CamerasManager.prototype = Object.create(null);
CamerasManager.prototype.constructor = CamerasManager;

CamerasManager.prototype.destroy = function() {
    this.app.scene.onBeforeRenderObservable.remove( this.beforeRender );
    this.beforeRender = null;
    this.lock = false;
    this.target = null;
};

CamerasManager.prototype._setupInputHandlers = function() {
    let down = false;
    this.inputManager.onPointerDownObservable.add((moveInfo) => {
        down = true;
    });
    this.inputManager.onPointerUpObservable.add((moveInfo) => {
        down = false;    
    });
    this.inputManager.onMoveObservable.add((moveInfo) => {
        const screenWidth = this.app.engine.getRenderWidth();
        const isPointerLocked = document.pointerLockElement === this.app.canvas;
        const isRightSideSwipe = moveInfo.event && moveInfo.event.clientX > screenWidth * this.swipeAreaHorizontalShare;
        const isJoystickMove = moveInfo.action === "joystick_move";

        if (moveInfo.action === "pointer_move" && down && !isJoystickMove && (isPointerLocked || isRightSideSwipe)) {

            this.defaultCamera.rotation.y += moveInfo.deltaX * this.rotationSensitivity;
            this.defaultCamera.rotation.x -= moveInfo.deltaY * this.rotationSensitivity;
            //console.log(`Camera swipe: deltaX=${moveInfo.deltaX}, deltaY=${moveInfo.deltaY}`);
        }
    });
    this.inputManager.onMoveObservable.add((event)=>{
        if(event.action === 'keyboard_move' ){
            this.defaultCamera.position.x -= event.direction.x/10;
            this.defaultCamera.position.z -= event.direction.y/10;
        }
    });


    




};

CamerasManager.prototype.resize = function(){
    if(this.defaultCamera.mode === Camera.ORTHOGRAPHIC_CAMERA){
        this._updateOrthographicCamera();
    }
}
CamerasManager.prototype._updateOrthographicCamera = function() {
    const camera = this.defaultCamera;
    if (camera.mode !== Camera.ORTHOGRAPHIC_CAMERA) {
        return;
    }
    const aspect = this.app.canvas.width / this.app.canvas.height;
    const halfHeight = this.TARGET_HEIGHT_UNITS / 2;
    camera.orthoTop = halfHeight; 
    camera.orthoBottom = -halfHeight;
    const halfWidth = halfHeight * aspect;
    camera.orthoLeft = -halfWidth; 
    camera.orthoRight = halfWidth; 
    // this.camera.position.x = this.SCENE_CENTER.x;
    // this.camera.position.z = this.SCENE_CENTER.z;
    console.log(`Camera resized: Aspect=${aspect.toFixed(2)}, Width=${halfWidth.toFixed(2) * 2}, Height=${this.TARGET_HEIGHT_UNITS}`);
};


CamerasManager.prototype.setPosition = function(vector){
    this.defaultCamera.position = vector;
}
CamerasManager.prototype.setTarget = function(node, forced = false){
    this.app.scene.onAfterRenderObservable.addOnce(()=>{
        if(node instanceof TransformNode){
            this.target = node;
        }else if(node instanceof Vector3){
            this.defaultCamera.setTarget(node);
        }
        if(forced)
            this.lock = true;
    });
}

CamerasManager.prototype.clearTarget = function(){
    this.app.scene.onAfterRenderObservable.addOnce(()=>{
        this.lock = false;
        this.target = null;
    });
}