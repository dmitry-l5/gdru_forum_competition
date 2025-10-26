import { Observable } from "@babylonjs/core/Misc/observable";

export function DataManager() {
    this._observers = [];
}

DataManager.prototype = Object.create(null);
DataManager.prototype.constructor = DataManager;

DataManager.prototype.addObserver = function(observable, callback, unregisterOnNextCall = false) {
    const observer = observable.add(callback, undefined, unregisterOnNextCall);
    this._observers.push(observer);
    return observer;
};

DataManager.prototype.removeObserver = function(observer) {
    if (observer && observer.observable) {
        observer.observable.remove(observer);
        this._observers = this._observers.filter(o => o !== observer);
    }
};

DataManager.prototype.dispose = function() {
    this._observers.forEach(observer => {
        if (observer && observer.observable) {
            observer.observable.remove(observer);
        }
    });
    this._observers = [];
    console.log(`${this.constructor.name} disposed.`);
};