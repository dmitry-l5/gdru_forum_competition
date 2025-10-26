export const ATTACK_SHAPE = {
    SECTOR:'sector',
    LINE:'line',
    CIRCLE:'circle',
};
export const PlaygroundAttackAreaMixin = {};

PlaygroundAttackAreaMixin.targetsOnArea = function(position, options){
    const { direction = null, range = 1, angle = Math.PI, shape = ATTACK_SHAPE.CIRCLE} = options;
    switch(shape){
        case ATTACK_SHAPE.CIRCLE:
            break;
        case ATTACK_SHAPE.LINE:
            break;
        case ATTACK_SHAPE.SECTOR:
            break;
        default:
            console.warn("Unknown attack shape");
            break;
    }
}

PlaygroundAttackAreaMixin.insideCircleSector = function(position, direction, range, angle){

}