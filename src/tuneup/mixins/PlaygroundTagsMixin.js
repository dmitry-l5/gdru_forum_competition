import { SpawnPoint } from "../../points/SpawnPoint";
import { ShootPoint } from "../../points/ShootPoint";
import { TriggerPoint } from "../../points/TriggerPoint";
import { TAGS } from "../common_const";

export const PlaygroundTagsMixin = {};

PlaygroundTagsMixin.navFloor = function(node) {
    console.log(`Playground: Обнаружен меш для NavMesh: ${node.name}`);
    this.navMeshFloor.push(node);
};

PlaygroundTagsMixin.spawnPoint = function(node, value, props) {
    console.log(`Playground: Обнаружена точка спавна: ${node.name} для типа "${value}"`);
    let point = new SpawnPoint(node.absolutePosition, { ...props, tagValue: value });
    this.spawnPoints.push(point);
};

PlaygroundTagsMixin.triggerPoint = function(node, value, props) {
    let trigger = new SpawnTriggerPoint(node.absolutePosition, { ...props, tagValue: value });
    this.triggerPoints.push(trigger);
};

PlaygroundTagsMixin.shootPoint = function(node, value, props) {
    console.log(`Playground: Обнаружена точка для стрельбы: ${node.name}`);
    let point = new ShootPoint(node.absolutePosition, {row: parseInt(value, 10), ...props,  ...this.convertNames(props)});
    this.shootPoints.push(point);
};

PlaygroundTagsMixin.playerPosition = function(node, value, props) {
    console.log(`Playground: Обнаружена позиция игрока: ${node.name} (${value})`);
    this.playerPositions[value] = {
        position: node.absolutePosition,
        next: props.next || null,
        prev: props.prev || null,
        isStart: props.start === 'true'
    };
};
PlaygroundTagsMixin.enterPath = function(node, value, props) {    
    console.log(`Playground: Обнаружена начальная позиция персонажа: ${node.name} (${value})`);
    if(!this.enterPaths){
        this.enterPaths = {};
        this.enterPaths[TAGS.LEFT] = {};
        this.enterPaths[TAGS.RIGHT] = {};
    }
    const points = [];
    let i = 1;
    while(props[TAGS.POINT_PREFIX + i] && props[TAGS.POINT_PREFIX + i].name){
        const pointNode = this.scene.getNodeByName(props[TAGS.POINT_PREFIX + i].name);
        if(pointNode && pointNode.absolutePosition){
            points.push(pointNode.absolutePosition.clone());
        }
        i++;
    }
    switch(value){
        case TAGS.LEFT:
            this.enterPaths[TAGS.LEFT][props.index] = points;
            break;
        case TAGS.RIGHT:
            this.enterPaths[TAGS.RIGHT][props.index] = points;
            break;
    }
};
PlaygroundTagsMixin.cameraMainLocation = function(node, value, props) {
    console.log(`Playground: Обнаружена начальная позиция мяча: ${node.name} (${value})`);
    this.cameraMainLocation = node;
};
PlaygroundTagsMixin.startPosition = function(node, value, props) {
    console.log(`Playground: Обнаружена начальная позиция мяча: ${node.name} (${value})`);
    if(this.startPosition != undefined){
        this.startPosition = node.position.clone();
    }
};

/**
 * Преобразует строку к 'Верблюжьей нотации'.
 */
PlaygroundTagsMixin.trueName = function(name) {
    return name.replace(/_([a-z])/g, (match, c) => c.toUpperCase());
};

PlaygroundTagsMixin.convertNames = function(obj = {}){
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = this.trueName(key);
        acc[newKey] = value;
        return acc;
    }, {});
}