import { App } from './js/App';
import './style.css';
import CoreAppModule from  './wasm/core_app';

let canvas = document.getElementById('canvas_app'); 

CoreAppModule().then(
    module=>{
        console.log("WASM Module is ready.");
        const app = new App(canvas, {
            wasm_module: module       
        });
    }
).catch(e => console.error("Ошибка при загрузке или инициализации WASM:", e));
