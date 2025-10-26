import { PlaygroundPoint } from "./PlaygroundPoint";

export function ShootPoint(vector, data = {}){
    PlaygroundPoint.call(this, vector, data);  
    this.bot = null;
}
ShootPoint.prototype = Object.create(PlaygroundPoint.prototype);
ShootPoint.prototype.constructor = ShootPoint;
