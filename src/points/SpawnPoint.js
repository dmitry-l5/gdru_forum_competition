import { PlaygroundPoint } from "./PlaygroundPoint";

export function SpawnPoint(vector, metadata = {}){
    PlaygroundPoint.call(this, vector, metadata)
    this.botType = metadata?.bot_type || 'solder';
    this.spawnedBot = null;
    this.radius = parseInt(metadata?.radius, 10) || 5;
    this.isOneTime = metadata?.one_time === 'true';
    this.cooldown = parseInt(metadata?.cooldown, 10) || 1000;
    this._nextEnableTime = 0;
}

SpawnPoint.prototype = Object.create(PlaygroundPoint.prototype);
SpawnPoint.prototype.constructor = PlaygroundPoint;

SpawnPoint.prototype.isEnabled = function(){
    return this._nextEnableTime < Date.now();
}

SpawnPoint.prototype.setEnable = function(forced = false){
    if(this.isOneTime){
        if(forced){
            this._nextEnableTime = 0;
        }
    }else{
        this._nextEnableTime = 0;
    }
    return this.isEnabled();
}

SpawnPoint.prototype.resetEnable = function(){
    if(this.isOneTime)
        this._nextEnableTime = Infinity;
    else
        this._nextEnableTime = Date.now() + this.cooldown;
    return this.isEnabled();
}