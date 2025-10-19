import { Color3, Engine, MeshBuilder, RawTexture, Sprite, SpriteManager, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

export const AppMapLoaderMixin = {};

AppMapLoaderMixin.loadLevelToWASM = async function(options){
    const {navigation = null} = options;
    if (navigation) {
        try {
            const nav_pixeles = await this._getPixelesFromBase64(navigation);
            this._sendImageDataToWASM(nav_pixeles.data, nav_pixeles.width, nav_pixeles.height);
        } catch (error) {
            console.error("Ошибка в процессе загрузки уровня в WASM:", error);
            throw error;
        }
    }
}

AppMapLoaderMixin._sendImageDataToWASM = function(rgbaData, width, height) {
    if (!this.wasmApp || !this.wasmApp.generateMapFromImage) {
        console.error("WASM Error: wasmApp или generateMapFromImage не доступны.");
        return;
    }

    const byteCount = rgbaData.length;
    const rgbaPtr = this.wasmModule._malloc(byteCount); 
    
    if (rgbaPtr === 0) {
        console.error("WASM Error: Ошибка выделения памяти WASM.");
        return;
    }
    try {
        this.wasmModule.HEAPU8.set(rgbaData, rgbaPtr);
        this.wasmApp.generateMapFromImage(rgbaPtr, width, height);
        console.log(`JS: Карта ${width}x${height} успешно передана и обработана в C++.`);
    } catch (e) {
        console.error("WASM Error: Ошибка при передаче или обработке данных в WASM.", e);
    } finally {
        this.wasmModule._free(rgbaPtr);
    }
};

AppMapLoaderMixin._getPixelesFromBase64 = async function(image_base64){
    return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let tempCanvas;
            try {
                const width = img.width;
                const height = img.height;
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const pixelData = ctx.getImageData(0, 0, width, height);
                tempCanvas.remove(); 
                resolve({
                    data: pixelData.data, 
                    width: width, 
                    height: height
                });
            } catch (e) {
                if (tempCanvas) {
                    tempCanvas.remove();
                }
                reject(new Error("Не удалось обработать пиксели изображения: " + e.message));
            }
        };
        img.onerror = (e) => reject(new Error("Не удалось загрузить Base64 изображение: " + e));
        img.src = image_base64;
    });
}

AppMapLoaderMixin.showDebugNavMap = function() {
    if (this.debugNavMap) {
        console.warn("Debug Nav Map уже отображена.");
        return;
    }

    if (!this.wasmApp || !this.wasmModule || !this.wasmModule.HEAPU8) {
        console.error("WASM или WASM HEAP не доступны.");
        return;
    }

    try {
        const dataPtr = this.wasmApp.getMapDataPtr();
        const width = this.wasmApp.getMapWidth();
        const height = this.wasmApp.getMapHeight();

        if (dataPtr === 0 || width <= 0 || height <= 0) {
            console.error("Отсутствуют данные навигационной карты WASM. Убедитесь, что карта загружена.");
            return;
        }
        const mapDataView = new Uint8Array(this.wasmModule.HEAPU8.buffer, dataPtr, width * height);
        const rgbaData = this._getDebugRGBAData(mapDataView, width, height);
        const texture = new RawTexture(
            rgbaData, 
            width,
            height, 
            Engine.TEXTUREFORMAT_RGBA, 
            this.scene
        );
        texture.updateSamplingMode(Texture.NEAREST_SAMPLINGMODE); 
        const navSpriteManager = new SpriteManager('debugNavMap', null, 1, {height:height, width:width}, this.scene);
        navSpriteManager.texture = texture;
        const mapSprite = new Sprite('map_sprite', navSpriteManager);
        mapSprite.width = width;
        mapSprite.height = height;
        mapSprite.position = new Vector3(0, 0, 0);  
        
        let center = MeshBuilder.CreateSphere('center', {diameter:10});
        center.position = Vector3.Zero();
        console.log(`Debug Nav Map (${width}x${height}) отображена.`);

    } catch (error) {
        console.error("Ошибка при отображении отладочной карты:", error);
    }
};


AppMapLoaderMixin.hideDebugNavMap = function() {
    if (this.debugNavMap) {
        debugger
        if (this.debugNavTexture) {
            this.debugNavTexture.dispose();
            this.debugNavTexture = null;
        }
        if (this.debugNavMaterial) {
            this.debugNavMaterial.dispose();
            this.debugNavMaterial = null;
        }
        this.debugNavMap.dispose();
        this.debugNavMap = null;

        this.debugNavMap = false;
        console.log("Debug Nav Map скрыта и удалена.");
    } else {
        console.warn("Debug Nav Map не найдена для скрытия.");
    }
};

AppMapLoaderMixin._getDebugRGBAData = function(mapDataView, width, height) {
    const rgbaData = new Uint8Array(width * height * 4);
    const length = width * height;
    for (let i = 0; i < length; i++) {
        const mapValue = mapDataView[i];
        let r, g, b;

        switch (mapValue) {
            case 0: // WALKABLE (Белый)
                r = 255; g = 255; b = 255;
                break;
            case 1: // OBSTACLE (Черный)
                r = 0; g = 0; b = 0;
                break;
            case 2: // WATER (Голубой)
                r = 0; g = 150; b = 255;
                break;
            default: // Unknown (Красный - ошибка)
                r = 255; g = 0; b = 0;
                break;
        }

        const rgbaIndex = i * 4;
        rgbaData[rgbaIndex] = r;
        rgbaData[rgbaIndex + 1] = g;
        rgbaData[rgbaIndex + 2] = b;
        rgbaData[rgbaIndex + 3] = 150;
    }
    return rgbaData;
}