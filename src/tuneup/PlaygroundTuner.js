import { Playground } from "../Playground";
import { TEAM_SLOTS } from "./teams_const";
import { UNITS_META } from "./units/units_const";
import { UnitFactory } from "./units/UnitFactory";
import { BEHAVIORS } from "./common_const";
import { Vector3 } from "@babylonjs/core";
import { BOT_FACTORY } from "./bots/bot_factory";
import { UI_EVENTS } from "./ui/ui_const";

export function PlaygroundTuner(world, options) {
    Playground.call(this, world, options); 
}

PlaygroundTuner.prototype = Object.create(Playground.prototype);
PlaygroundTuner.prototype.constructor = PlaygroundTuner;

PlaygroundTuner.prototype.update = function(deltaTime){
    Playground.prototype.update.call(this, deltaTime);
}

PlaygroundTuner.prototype.customLogic = function(deltaTime){
    // this.handleSpawnPoints?.(this.spawnPoints);
}
Playground.prototype.handleClick = function(pickResult){
    // debugger
    let unitsToMove;
    const clickPoint = pickResult?.pickedPoint;
    if(this.selectedUnits && this.selectedUnits.size > 0){
        unitsToMove = Array.from(this.selectedUnits); 
    } else {
        unitsToMove = Object.values(this.playerTeam).filter(item => item);
    }
    const points = this._getTrianglePoints(clickPoint, unitsToMove.length);
    if (pickResult && clickPoint && unitsToMove.length > 0) {
        unitsToMove.forEach((unit, index) => {
            const targetPoint = points[index];
            if (!targetPoint) {
                console.warn(`Playground: Недостаточно точек для всех юнитов.`);
                return;
            }
            const path = this.pathfinder.findPath(unit.root.position, targetPoint);
            
            if (path && path.length > 0) {
                unit.setPath(path);
                unit.setBehavior(BEHAVIORS.FOLLOW_PATH); 
                console.log(`Playground: Юниту ${unit.root.name} назначен путь с ${path.length} точками.`);
            } else {
                console.log(`Playground: Путь не найден для ${unit.root.name} до ${targetPoint}.`);
                unit.stopMoving();
            }
        });
    }
}

PlaygroundTuner.prototype.spawnBot = async function(point) {
    point.inProgress = true;
    try{
        if (!point.spawnedBot || point.spawnedBot.isDead) {
            const botType = point.botType;
            const constructor = BOT_FACTORY[botType];
            if (!constructor) {
                //  console.error(`Playground: Неизвестный тип бота: "${botType}". Спавн отменен.`);
                return;
            }
            const bot = new constructor(this.scene, point.location, {
                resourceLoader: this.resourceLoader,
                world: this.world,
                pathfinder: this.pathfinder,
                playground: this,
                playgroundActionCallback: this.handlePlaygroundAction.bind(this),
                sightRadius: 20,
                pursuitRange: 25,
                stopPursuitRange: 30,
                // [ATTACK_TYPE.MELEE]: true,
                // meleeAttackDistance: 3,
                // [ATTACK_TYPE.RANGED]: true,
                // rangedAttackDistance: 10,
                // preferredAttack: ATTACK_TYPE.MELEE,
                // projectileType: PROJECTILE_TYPE.DEFAULT
            });
            await bot.init();
            this.bots.push(bot);
            point.spawnedBot = bot;

            point.isTriggered = true;
            point.lastTriggerTime = Date.now();
            //  console.log(`Playground: Бот типа "${botType}" создан.`);
        }
    } catch(error) {
         console.error("Ошибка при спавне бота:", error);
    } finally {
        point.isSpawning = false;
    }
};

// PlaygroundTuner.prototype.handleSpawnPoints = function(spawn_points){
//     // const playerPosition = this.world.player.root.position;
//     spawn_points.forEach(point => {
//         if( !point.inProgress &&
//             point.isEnabled?.() &&
//             Vector3.Distance(playerPosition, point.location) <= point.radius
//         ) {
//                 this.spawnBot(point);
//                 point.resetEnable();
//         }
//     });
// }


PlaygroundTuner.prototype.instantiatePlayerTeam = async function(options = {}){
    const {gate = null} = options;
    const team_data = this.app.gameDataManager.team;
    const main_unit_id = team_data[TEAM_SLOTS.MAIN];
    if (!main_unit_id) return; 
    const meta_main = UNITS_META[main_unit_id];
    const gate_position = this.gates[meta_main.gates] ?? Vector3.Zero();
    
    const points = this._getTrianglePoints(gate_position, 3);
    const slot_positions = {
        [TEAM_SLOTS.MAIN]: points[0],
        [TEAM_SLOTS.SECOND]: points[1],
        [TEAM_SLOTS.THIRD]: points[2],
    };
    const buildPromises = Object.entries(this.playerTeam)
        .map(([slot_id, unit]) => {
            const unit_id = team_data[slot_id];
            if (unit_id) {
                return UnitFactory.build( 
                    unit_id, 
                    { metadata: UNITS_META[unit_id], position: Vector3.Zero() }, 
                    this.resourceLoader, 
                    this.scene
                ).then((char) => ({ 
                    slot_id, 
                    char, 
                    target_position: slot_positions[slot_id] 
                }));
            }
            return null;
        })
        .filter(p => p !== null);
    const results = await Promise.all(buildPromises);

    results.forEach(({ slot_id, char, target_position }) => {
        char.root.position.copyFrom(target_position); 
        this.playerTeam[slot_id] = char;
        if (slot_id === TEAM_SLOTS.MAIN) {
            this.world.player = char; 
        }
    });
    this.app.cameras.setTarget(this.playerTeam[TEAM_SLOTS.MAIN].root, true);

    Object.keys(this.playerTeam).forEach(slot_id => {
        if (!team_data[slot_id]) {
            // console.log(`Слот ${slot_id} пуст.`);
        }
    });
}

// PlaygroundTuner.prototype.instantiatePlayerTeam = async function(options = {}) {
//     const { gate = null } = options;
//     const team_data = this.app.gameDataManager.team;
//     const gate_position = this.gates[gate || meta_main.gates] ?? Vector3.Zero();
//     const buildPromises = Object.entries(this.playerTeam)
//         .map(([slot_id, unit_id]) => {
//             if(team_data[slot_id]){

//                 const metadata = UNITS_META[unit_id];
                
//                 return UnitFactory.build(
//                     unit_id, 
//                     { metadata, position: Vector3.Zero() }, 
//                     this.resourceLoader, 
//                     this.scene
//                 ).then((char) => ({ slot_id, char }));
//             }
//             return null;
//         });
//     const results = await Promise.all(buildPromises);
//     results.forEach(({ slot_id, char }) => {
//         char.root.position.copyFrom(gate_position); 
//         this.playerTeam[slot_id] = char;
//         if (slot_id === TEAM_SLOTS.MAIN) {
//             this.world.player = char; 
//         }
//     });
// };


PlaygroundTuner.prototype.handleTriggerAction = function(trigger) {
    switch(trigger.action) {
        case 'open_door':
            // Логика открытия двери
            break;
        case 'play_audio':
            // Логика проигрывания звука
            break;
        default:
            //  console.warn(`Неизвестное действие триггера: ${trigger.action}`);
            break;
    }
};
PlaygroundTuner.prototype._getTrianglePoints = function(center, radius = 1.0) {
    const points = [];
    const numPoints = 3;
    const center_y = center.y;
    for (let i = 0; i < numPoints; i++) {
        const angle = i * (2 * Math.PI / numPoints); 
        const x_offset = radius * Math.sin(angle);
        const z_offset = radius * Math.cos(angle);

        points.push(new Vector3(
            center.x + x_offset,
            center_y,
            center.z + z_offset
        ));
    }

    return points;
};

PlaygroundTuner.prototype.selectSingleUnit = function(slot_id){
    const unit = this.playerTeam[slot_id];
    if (!unit) {
        this.selectedUnits.clear();
        this.app.cameras.setTarget(null);
        console.warn(`Playground: Слот ${slot_id} пуст. Выбор сброшен.`);
        return;
    }
    this.selectedUnits.clear();
    this.selectedUnits.add(unit);
    // debugger;
    this.app.cameras.setTarget(unit.root, true);
    console.log(`Playground: Выбран единственный юнит: ${unit.root.name}`);
}

PlaygroundTuner.prototype.selecAddtUnit = function(slot_id){
    const unit = this.playerTeam[slot_id];
    if (!unit) {
        console.warn(`Playground: Слот ${slot_id} пуст. Невозможно добавить.`);
        return;
    }
    if (!this.selectedUnits.has(unit)) {
        this.selectedUnits.add(unit);
        this.app.cameras.setTarget(unit.root, true); 
        console.log(`Playground: Юнит добавлен в выбор: ${unit.root.name}. Всего: ${this.selectedUnits.size}`);
    } else {
        console.log(`Playground: Юнит ${unit.root.name} уже выбран.`);
    }
}

PlaygroundTuner.prototype.selectRemoveUnit = function(slot_id){
    const unit = this.playerTeam[slot_id];
    if (!unit) {
        console.warn(`Playground: Слот ${slot_id} пуст. Нечего удалять.`);
        return;
    }
    const wasDeleted = this.selectedUnits.delete(unit);
    if (wasDeleted) {
        console.log(`Playground: Юнит удален из выбора: ${unit.root.name}. Осталось: ${this.selectedUnits.size}`);
        if (this.selectedUnits.size === 0) {
            this.app.cameras.setTarget(null);
            console.log('Playground: Выбор пуст. Камера сброшена.');
        } else if (this.app.cameras.target === unit.root) {
            const newTarget = this.selectedUnits.values().next().value;
            this.app.cameras.setTarget(newTarget.root, false);
            console.log(`Playground: Камера переключена на ${newTarget.root.name}.`);
        }
    } else {
        console.log(`Playground: Юнит ${unit.root.name} не был выбран.`);
    }
}

PlaygroundTuner.prototype.selectToggleUnit = function(slot_id){
    const unit = this.playerTeam[slot_id];   
    if (!unit) {
        console.warn(`AppMapEvents: Слот ${slot_id} пуст. Нечего выбирать.`);
        return;
    }
    if (this.selectedUnits.has(unit)) {
        this.selectRemoveUnit(slot_id);
        console.log(`AppMapEvents: Юнит в слоте ${slot_id} снят с выбора.`);
    } else {
        this.selecAddtUnit(slot_id); 
        console.log(`AppMapEvents: Юнит в слоте ${slot_id} добавлен к выбору.`);
    }
    this._reloadTeamPanels();
}
PlaygroundTuner.prototype._reloadTeamPanels = function(){
    const team_data = this._collectSelectedUnitData();
    this.app.uiHandler(
        UI_EVENTS.UPDATE_TEAM_DATA,
        {
            data:team_data,
        }
    )
}
PlaygroundTuner.prototype._collectSelectedUnitData = function(){
    const data = {};
    Object.entries(this.playerTeam).forEach(([key, value])=>{
        if(this.selectedUnits.has(value)){
            data[key] = value.getInfo();
        }        
    });
    return data;
}