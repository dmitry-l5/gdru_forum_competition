import { PlaygroundPoint } from "./PlaygroundPoint";

export function TriggerPoint(vector, metadata = {}){
    PlaygroundPoint.call(this, vector, metadata)

    this.action = metadata?.action || 'default';
    this.radius = parseInt(metadata?.radius, 10) || 5;
    this.isOneTime = metadata?.one_time === 'true';
    this.isTriggered = false;
    this.lastTriggerTime = 0;
    this.cooldown = parseInt(metadata?.cooldown, 10) || 0;
}
TriggerPoint.prototype = Object.create(PlaygroundPoint.prototype);
TriggerPoint.prototype.constructor = PlaygroundPoint; 

TriggerPoint.prototype.setLastTriggerTime = function(){
    this.lastTriggerTime = Date.now();
    return this.lastTriggerTime;
}

TriggerPoint.prototype.check = function(metadata){
    const {vector} = metadata;

}

