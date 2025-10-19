import Polylang from "polylang";
import { LANGS } from "./consts/common_const";
import { dictionary_ru } from "./locals/ru";
import { dictionary_en } from "./locals/en";
import { Engine, Scene, TargetCamera, Vector3, HemisphericLight, MeshBuilder, Color3, FreeCamera, Camera } from "@babylonjs/core";

export function BaseApp(canvas, options){
    // 💡 Принимаем wasm_app (экземпляр wasmApp)
    const {core_app, wasm_app} = options; 

    this.TARGET_HEIGHT_UNITS = 50;

    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.camera = null;

    this.polylang = new Polylang();
    this.polylang.add('ru', dictionary_ru);
    this.polylang.add('en', dictionary_en);
    this.polylang.lang = LANGS.RU;

    this._init();
}
BaseApp.prototype = Object.create(null);
BaseApp.prototype.constructor = BaseApp;

BaseApp.prototype._init = function(){
    const engine = this.engine = new Engine(this.canvas, true);
    const scene = this.scene = new Scene(engine);
    scene.clearColor = Color3.Purple(); //.FromHexString("#ffffff");
    this.camera = new FreeCamera('default_camera', new Vector3(0, 10, 0), scene);
    this.camera.setTarget(Vector3.Zero());
    // this.camera.attachControl(this.canvas, true);
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this._updateOrthographicCamera();

    new HemisphericLight("light", Vector3.Up(), scene);
    engine.runRenderLoop(() => {
        const deltaTime = engine.getDeltaTime() / 1000.0;
        this.appBeforeRender?.(deltaTime);
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
        this._updateOrthographicCamera();
    });
}

BaseApp.prototype._updateOrthographicCamera = function() {
    if (this.camera.mode !== Camera.ORTHOGRAPHIC_CAMERA) {
        return;
    }
    const aspect = this.engine.getRenderingCanvas().width / this.engine.getRenderingCanvas().height;
    const halfHeight = this.TARGET_HEIGHT_UNITS / 2;
    this.camera.orthoTop = halfHeight; 
    this.camera.orthoBottom = -halfHeight;
    const halfWidth = halfHeight * aspect;
    this.camera.orthoLeft = -halfWidth; 
    this.camera.orthoRight = halfWidth; 
    // this.camera.position.x = this.SCENE_CENTER.x;
    // this.camera.position.z = this.SCENE_CENTER.z;
    console.log(`Camera resized: Aspect=${aspect.toFixed(2)}, Width=${halfWidth.toFixed(2) * 2}, Height=${this.TARGET_HEIGHT_UNITS}`);
};
