import '../../style.css';
import CoreAppModule from  '../../wasm/core_app';
import { MapEditor } from './MapEditor';

let canvas = document.getElementById('canvas_app');

const editor = new MapEditor(canvas, {});
editor.start();
