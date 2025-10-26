import { Observable } from "@babylonjs/core/Misc/observable";
import { PlayerStatsManager } from "./tuneup/PlayerStatsManager";

export function GameDataManager() {
    this.playerStatsManager = new PlayerStatsManager();

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

GameDataManager.prototype.dispose = function() {
    this.playerStatsManager.dispose();
    // if (this.inventory) this.inventory.dispose();
    // if (this.questLog) this.questLog.dispose();
    console.log("GameDataManager disposed.");
};