import { Vector3 } from "@babylonjs/core"; // Предполагаем доступность Vector3

export const ATTACK_SHAPE = {
    SECTOR:'sector',
    LINE:'line',
    CIRCLE:'circle',
};
export const PlaygroundAttackAreaMixin = {};

/**
 * Ищет цели в заданной области.
 * * @param {Vector3} position - Центр или начало области атаки (позиция атакующего).
 * @param {object} options - Параметры атаки.
 * @param {Vector3} [options.direction=null] - Вектор направления атаки (для SECTOR и LINE).
 * @param {number} [options.range=1] - Максимальная дальность (радиус) атаки.
 * @param {number} [options.angle=Math.PI] - Угол сектора в радианах (для SECTOR).
 * @param {string} [options.shape=ATTACK_SHAPE.CIRCLE] - Форма атаки.
 * @param {Character} [options.excludedTarget=null] - Юнит, который должен быть исключен (обычно сам атакующий).
 * @returns {Array<Character>} Список найденных юнитов.
 */
PlaygroundAttackAreaMixin.targetsOnArea = function(position, options) {
    const { 
        direction = null, 
        range = 1, 
        angle = Math.PI, 
        shape = ATTACK_SHAPE.CIRCLE, 
        excludedGroup = null
    } = options;
    const targetsInArea = [];
    
    // 1. Сбор всех потенциальных живых юнитов в мире (боты + юниты игрока)
    let allUnits = [];
    const test = Object.values(this.playerTeam);
    Object.values(this.playerTeam).forEach(unit => {
        if (unit && unit.stats?.health > 0 && unit.group !== excludedGroup) {
            allUnits.push(unit);
        }
    });
    this.bots.forEach(unit => {
        if (unit && unit.stats?.health > 0 && unit.group !== excludedGroup) {
            allUnits.push(unit);
        }
    });

    const rangeSq = range * range;

    // 2. Проверка каждого юнита
    for (const target of allUnits) {
        const targetPosition = target.root.position;
        const distanceSq = Vector3.DistanceSquared(position, targetPosition);
        
        // Оптимизация: Отсекаем юнитов вне максимального радиуса
        if (distanceSq > rangeSq) {
            continue;
        }

        switch (shape) {
            case ATTACK_SHAPE.CIRCLE:
                // Проверка на расстояние уже прошла выше
                targetsInArea.push(target);
                break;
                
            case ATTACK_SHAPE.SECTOR:
                // Проверка на расстояние и угол
                if (direction && this.insideCircleSector(position, direction, range, angle, targetPosition)) {
                    targetsInArea.push(target);
                }
                break;
                
            case ATTACK_SHAPE.LINE:
                // Проверка на расстояние и узкий конус
                if (direction && this._insideLineArea(position, direction, range, targetPosition)) {
                    targetsInArea.push(target);
                }
                break;
                
            default:
                console.warn("Unknown attack shape:", shape);
                break;
        }
    }

    return targetsInArea;
};

/**
 * Проверяет, находится ли позиция цели внутри сектора.
 * * @param {Vector3} position - Центр сектора.
 * @param {Vector3} direction - Вектор направления сектора.
 * @param {number} range - Радиус сектора.
 * @param {number} angle - Угол сектора в радианах.
 * @param {Vector3} targetPosition - Позиция цели.
 * @returns {boolean}
 */
PlaygroundAttackAreaMixin.insideCircleSector = function(position, direction, range, angle, targetPosition) {
    const vectorToTarget = targetPosition.subtract(position);
    
    // Расстояние уже проверено в targetsOnArea, но для чистоты кода
    if (vectorToTarget.lengthSquared() > range * range) {
        return false;
    }
    
    // Вычисляем косинус угла между направлением атаки и вектором к цели
    const normalizedDirection = direction.normalize();
    const normalizedVectorToTarget = vectorToTarget.normalize();
    
    const dotProduct = Vector3.Dot(normalizedDirection, normalizedVectorToTarget);
    const clampedDot = Math.max(-1, Math.min(1, dotProduct)); // Защита от ошибок float
    
    const halfAngle = angle / 2.0;
    
    // Если косинус угла (dotProduct) больше или равен косинусу половины угла сектора (maxAngleCos), то цель внутри.
    // Например: для сектора в 90 град (PI/2), halfAngle = PI/4. cos(PI/4) ≈ 0.707. 
    // Цели с dot > 0.707 будут внутри.
    const maxAngleCos = Math.cos(halfAngle); 
    
    return clampedDot >= maxAngleCos;
};

/**
 * Проверяет, находится ли позиция цели в узком конусе (имитация "линейной" атаки).
 * * @param {Vector3} startPosition - Начальная точка.
 * @param {Vector3} direction - Вектор направления.
 * @param {number} range - Дальность.
 * @param {Vector3} targetPosition - Позиция цели.
 * @returns {boolean}
 */
PlaygroundAttackAreaMixin._insideLineArea = function(startPosition, direction, range, targetPosition) {
    // Используем очень узкий конус (например, 10 градусов в каждую сторону)
    
    const vectorToTarget = targetPosition.subtract(startPosition);
    if (vectorToTarget.lengthSquared() > range * range) {
        return false; // На всякий случай, хотя targetsOnArea уже отсеял
    }
    
    const normalizedDirection = direction.normalize();
    const normalizedVectorToTarget = vectorToTarget.normalize();
    
    const dotProduct = Vector3.Dot(normalizedDirection, normalizedVectorToTarget);
    
    // Максимальный угол для атаки по линии (10 градусов)
    const MAX_LINE_ANGLE_RAD = Math.PI / 18; 
    const maxAngleCos = Math.cos(MAX_LINE_ANGLE_RAD); 

    // Цель считается в области, если угол между направлением атаки и вектором к цели очень мал
    return dotProduct >= maxAngleCos; 
};













// export const ATTACK_SHAPE = {
//     SECTOR:'sector',
//     LINE:'line',
//     CIRCLE:'circle',
// };
// export const PlaygroundAttackAreaMixin = {};

// PlaygroundAttackAreaMixin.targetsOnArea = function(position, options){
//     const { direction = null, range = 1, angle = Math.PI, shape = ATTACK_SHAPE.CIRCLE} = options;
//     switch(shape){
//         case ATTACK_SHAPE.CIRCLE:
//             break;
//         case ATTACK_SHAPE.LINE:
//             break;
//         case ATTACK_SHAPE.SECTOR:
//             break;
//         default:
//             console.warn("Unknown attack shape");
//             break;
//     }
// }

// PlaygroundAttackAreaMixin.insideCircleSector = function(position, direction, range, angle){

// }