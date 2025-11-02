import { Observable } from "@babylonjs/core/Misc/observable";
import { PlayerStatsManager } from "./tuneup/PlayerStatsManager";
import { TEAM_SLOTS } from "./tuneup/teams_const";
import { UNITS_META } from "./tuneup/units/units_const";

export function GameDataManager() {
    this.playerStatsManager = new PlayerStatsManager();
    this.availableChars = {};
    this.startCharSelected = false;
    this.team = {
        [TEAM_SLOTS.MAIN]: null,
        [TEAM_SLOTS.SECOND]: null,
        [TEAM_SLOTS.THIRD]: null,
    }
    
    this.initDataSet();

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

GameDataManager.prototype.initDataSet = function(){
    this.dispose();
    this.playerStatsManager = new PlayerStatsManager();

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
