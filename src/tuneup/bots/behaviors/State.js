export function State(bot, animator){
    this.bot = bot;
    this.animator = animator;
}
State.prototype = Object.create(null);
State.prototype.constructor = State;

State.prototype.enter = async function(){
    return new Promise((resolve, reject)=>{
        const condition = this.checkEnterCondition?.() ?? false;
        if(condition){
            this.prepare?.();
            this.prepareAndStart?.();
            resolve();
        }else{
            reject();
        }
    });
}
State.prototype.exit = async function(){
    return new Promise((resolve, reject)=>{
        // clear state
        resolve();
    });
}

State.prototype.checkEnterCondition = function(){
    return true;
}

State.prototype.update = function(deltaTime){
    // Must be overwrite
}

State.prototype.destroy = function(){

}