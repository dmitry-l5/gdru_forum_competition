export function PlaygroundPoint(vector, data = {}){
    this.location = vector;
    this.metadata = null;
    this.inProgress = false;
    this._enabled = false;


    if(Object.keys(data).length > 0){
        this.handleData(data);
    }
}
PlaygroundPoint.prototype = Object.create(null);
PlaygroundPoint.prototype.constructor = PlaygroundPoint;
PlaygroundPoint.prototype.isEnabled = function(){
    return this._enabled?true:false;
}
PlaygroundPoint.prototype.setEnable = function(){
    this._enabled = true;
    return this._enabled;
}
PlaygroundPoint.prototype.resetEnable = function(){
    this._enabled = false;
    return this._enabled;
}

// virtual
PlaygroundPoint.prototype.handleData = function(data){
    this.metadata = data;
}

