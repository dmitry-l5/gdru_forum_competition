export function YandexSDKManager(){
    this._ysdk = null;
    this._player = null;
    this._isInitialized = false;
    this._initPromise = null;
    this.sdkScriptUrl = './sdk.js';
    this.enabled = true;
}
YandexSDKManager.prototype = Object.create(null);
YandexSDKManager.prototype.constructor = YandexSDKManager;
YandexSDKManager.prototype.init = async function(options = {}){
    if (this._initPromise) {
        return this._initPromise;
    }
    if (this._isInitialized && this._ysdk) {
        return this._ysdk;
    }

    this._initPromise = (async () => {
        try {
            if (typeof YaGames === 'undefined') {
                await this._loadScript(this.sdkScriptUrl);
                if (typeof YaGames === 'undefined') {
                    throw new Error('YaGames global not found after script load. SDK might not have initialized correctly or its global name is different.');
                }
            }
            this._ysdk = await YaGames.init();
            console.log('Yandex SDK initialized successfully.');
            this._isInitialized = true;
            return this._ysdk;
        } catch (error) {
            console.error('Yandex SDK initialization error:', error);
            this._isInitialized = true;
            this._ysdk = null;
            this._player = null;
            throw error;
        } finally {
            this._initPromise = null; 
        }
    })();
    return this._initPromise;    
}

YandexSDKManager.prototype._loadScript = function(){
    return new Promise((resolve, reject)=>{
        const script = document.createElement('script');
        script.src =  this.sdkScriptUrl;
        script.async = true;
        script.onload = ()=>{
            resolve();
        }
        script.onerror = ()=>{
            reject(new Error(`Failed to load script: ${this.sdkScriptUrl}. Error: ${e.message || 'Unknown'}`));
        }
        document.head.appendChild(script);
    });
}

Object.defineProperty(YandexSDKManager.prototype, 'ysdk', {
    get: function() {
        return this._ysdk;
    }
});

Object.defineProperty(YandexSDKManager.prototype, 'player', {
    get: function() {
        return this._player;
    }
});

YandexSDKManager.prototype.isInitialized = function() {
    return this._isInitialized;
};

YandexSDKManager.prototype.gameplayStart = function() {
    this._ysdk?.features.GameplayAPI?.start();
};

YandexSDKManager.prototype.gameplayStop = function() {
    this._ysdk?.features.GameplayAPI?.stop();
};

YandexSDKManager.prototype.showFullscreenAd = async function(options) {
    if (!this._ysdk) {
        console.warn('Yandex SDK not initialized. Cannot show fullscreen ad.');
        options.onError?.(new Error('SDK not initialized'));
        return;
    }
    try {
        await this._ysdk.adv.showFullscreenAdv();
    } catch (error) {
        console.error('Failed to show fullscreen ad:', error);
        options.onError?.(error);
    }
};

export const yandexSDKManager = new YandexSDKManager();