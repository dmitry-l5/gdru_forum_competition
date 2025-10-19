import JSZip from "jszip";
import { RESOURCES_META, ZIP_PREFIX } from "./consts/resource_const";

export function ResourceLoader(){
    this.arhives = {};
    const envValue = import.meta.env.VITE_RES_LOCAL_MODE;
    this.localMode = (envValue && typeof envValue === 'string') ? envValue.trim() === 'true' : false;
    // this.localMode = import.meta.env.VITE_RES_LOCAL_MODE?true:false;
    console.log("ResourceLoader.localMode set to:", this.localMode);
    this.loadingPromises = {};
}
ResourceLoader.prototype = Object.create(null);
ResourceLoader.prototype.constructor = ResourceLoader;

ResourceLoader.prototype.require = function(RES_CONST, options = {}){
    const {onProgress = null} = options;
    if(this.localMode){
        return Promise.resolve();
    }else{
        return this.loadArchive(RES_CONST, {onProgress: onProgress} );
    }
}

ResourceLoader.prototype.loadArchive = function(RES_CONST, {onProgress = null} = {}){
    if (this.arhives[RES_CONST]) 
        return Promise.resolve();
    if (this.loadingPromises[RES_CONST])
        return this.loadingPromises[RES_CONST];
    const xhr = new XMLHttpRequest();
    const path = `${ZIP_PREFIX}/${RES_CONST}.zip`;
    xhr.open('GET', path, true);
    xhr.responseType = 'arraybuffer';
    if( typeof onProgress === 'function'){
        xhr.onprogress = onProgress;
    }

    const res = this;
    const loadPromise = new Promise((resolve, reject)=>{
        xhr.onload = async function(){
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const jszip = new JSZip();
                    const data = await jszip.loadAsync(xhr.response); 
                    res.arhives[RES_CONST] = data;
                    resolve();
                } catch (zipError) {
                    reject(new Error(`Некорректный ZIP-архив: ${RES_CONST}`));
                }finally{
                    delete res.loadingPromises[RES_CONST];
                }
            } else {
                reject(new Error(`Не удалось загрузить ресурс: ${RES_CONST}, Статус: ${xhr.status}`));
                delete res.loadingPromises[RES_CONST];
            }
        };
        xhr.onerror = function(){
            reject(new Error(`Сетевая ошибка при загрузке ресурса: ${RES_CONST}`));
            delete res.loadingPromises[RES_CONST];
        };
        xhr.send();
    });

    this.loadingPromises[RES_CONST] = loadPromise;
    return loadPromise;
}

ResourceLoader.prototype.getMeta = function(META_ID){
    return RESOURCES_META[META_ID];
}
ResourceLoader.prototype.getFile = async function( path, CHUNK_CONST, options = {}) {
    const { format = 'arraybuffer', prefix='' } = options;
    // const { format = 'base64', prefix = "data:;base64," } = options;
    if(this.localMode){
        const fileUrl = `/${ZIP_PREFIX}/${CHUNK_CONST}/${path}`; 
        return fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${fileUrl}`);
                }
                return response.arrayBuffer(); 
            })
            .then(arrayBuffer => {
                if (format === 'arraybuffer') {
                    return Promise.resolve(new Uint8Array(arrayBuffer));
                } else if (format === 'base64') {   
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64String = reader.result.split(',')[1];
                            resolve(prefix + base64String); 
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(new Blob([arrayBuffer]));
                    });
                }else {
                    throw new Error(`Не поддерживаемый формат: ${format}. Выбери 'arraybuffer' или 'base64'.`);
                }
            })
            .catch(error => {
                return Promise.reject(new Error(`Не удалось загрузить локальный файл: ${path}. Ошибка: ${error.message}`));
            });
    }else{
        if (!this.arhives[CHUNK_CONST]) {
            await this.loadArchive(CHUNK_CONST);
        }

        const resource = this.arhives[CHUNK_CONST].file(path);
        if(!resource){
            return Promise.reject(new Error(`File "${path}" not found in the ZIP.`));
        }
        if (format === 'arraybuffer') {
            return resource.async('uint8array');
        } else if (format === 'base64') {
            return resource.async('base64').then(base64String => prefix + base64String);
        } else {
            return Promise.reject(new Error(`Не поддерживаемый формат: ${format}. Выбери 'arraybuffer' или 'base64'.`));
        }
    }
}