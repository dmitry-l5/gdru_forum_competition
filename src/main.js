import { App } from './App'
import './style.css'
import { yandexSDKManager } from './YandexSDKManager';
// import Recast from 'recast-detour';

// window.recast = await Recast();
const canvas = document.getElementById('canvas_app');
const load_screen = document.getElementById('pre_load_screen');
let ysdk = null;
let ysdk_manager = null;
if(import.meta.env.VITE_YSDK){
  ysdk = await yandexSDKManager.init();
  ysdk_manager = yandexSDKManager;
}



const app = new App(canvas, {pre_load_screen: load_screen, ysdk_manager: ysdk_manager } );