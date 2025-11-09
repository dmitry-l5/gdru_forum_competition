import { Observable } from "@babylonjs/core/Misc/observable";
import { PlayerStatsManager } from "./tuneup/PlayerStatsManager";
import { TEAM_SLOTS } from "./tuneup/teams_const";
import { UNITS_ID, UNITS_META } from "./tuneup/units/units_const";
import { MAPS_ID } from "./tuneup/maps_const";

export function GameDataManager() {
    this.playerStatsManager = new PlayerStatsManager();
    this.availableChars = {};
    this.startCharSelected = false;
    this.team = {
        [TEAM_SLOTS.MAIN]: null,
        [TEAM_SLOTS.SECOND]: null,
        [TEAM_SLOTS.THIRD]: null,
    }
    
    this.initDataset();

    // this.gameData = {
    //     score: 0,
    //     playerHealth: 100,
    //     currentLevel: 1,
    //     isPaused: false,
    // };
    // this.onScoreChangedObservable = new Observable();
    // this.onPlayerHealthChangedObservable = new Observable();
    // this.onLevelChangedObservable = new Observable();
    // this.onPauseStatusChangedObservable = new Observable();
}

GameDataManager.prototype = Object.create(null);
GameDataManager.prototype.constructor = GameDataManager;

GameDataManager.prototype.initDevDataset = function(index){
    const dataset = {
        1:{
            map:{
                id:MAPS_ID.INTRO,
                gateId:1,
            },
            team:{
                [TEAM_SLOTS.MAIN]: UNITS_ID.KAIDEN,
                [TEAM_SLOTS.SECOND]: UNITS_ID.RANGER_FOX,
                [TEAM_SLOTS.THIRD]: UNITS_ID.ARIANA,
            }

        },
        2:{
            map:{
                // id:MAPS_ID.START,
                id:MAPS_ID.INTRO,
                gateId:2,
            },
            team:{
                [TEAM_SLOTS.MAIN]: UNITS_ID.ARIANA,
                // [TEAM_SLOTS.SECOND]: UNITS_ID.KAIDEN,
                // [TEAM_SLOTS.THIRD]: UNITS_ID.KAIDEN,
            }

        }
    }
    if(dataset[index]){
        this.applyDataset(dataset[index]);
        return true;    
    }else
        return false;
}
GameDataManager.prototype.setCharacterToSlot = function(unit_id, slot_id){
    if (slot_id in this.team) {
        this.team[slot_id] = unit_id;
    } else {
        console.warn(`[GameDataManager] Попытка установить персонажа ${unit_id} в несуществующий слот: ${slot_id}`);
    }
}
GameDataManager.prototype.initDataset = function(){
    this.dispose();
    this.playerStatsManager = new PlayerStatsManager();
    this.currentMap = MAPS_ID.INTRO;
    this.currentMapGate = 0;
}
GameDataManager.prototype.applyDataset = function(dataset){
    this.validateDataset?.(dataset);

    this.currentMap = dataset.map.id;
    this.currentGate = dataset.map.gateId;
    this.team[TEAM_SLOTS.MAIN] = dataset.team[TEAM_SLOTS.MAIN]??null;
    this.team[TEAM_SLOTS.SECOND] = dataset.team[TEAM_SLOTS.SECOND]??null;
    this.team[TEAM_SLOTS.THIRD] = dataset.team[TEAM_SLOTS.THIRD]??null;
    

}

GameDataManager.prototype.dispose = function() {
    this.playerStatsManager?.dispose();
    if (this.team) {
        for (const slotKey in this.team) {
            if (this.team.hasOwnProperty(slotKey)) {
                const item = this.team[slotKey];
                if (item && typeof item.dispose === 'function') {
                    item.dispose(); 
                }
                this.team[slotKey] = null;
            }
        }
    }
    this.availableChars = {};
    this.startCharSelected = false;
    this.team = {
        [TEAM_SLOTS.MAIN]: null,
        [TEAM_SLOTS.SECOND]: null,
        [TEAM_SLOTS.THIRD]: null,
    }
    this.playerStatsManager = null; 
    console.log("GameDataManager disposed.");
};

GameDataManager.prototype.getStartHeroes = function getStartHeroes(){
    const list = Object.keys(UNITS_META).filter(unitId => UNITS_META[unitId].evailableOnStart);
    return list;
}
