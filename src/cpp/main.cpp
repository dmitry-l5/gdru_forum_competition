#include <emscripten/bind.h>
#include <iostream>
#include <string>
#include <vector>
#include <cstdint>
#include "InputProcessor.h"
#include "MapLoader.h"

using namespace emscripten;
using namespace std;

const int INPUT_BUFFER_SIZE = 4;
int sharedInputState[INPUT_BUFFER_SIZE] = {0, 0, 0, 0}; 

class App{
private:
    int updateCounter = 0;
    InputProcessor inputProcessor;
    MapLoader mapLoader;

    std::vector<int> currentMapData;
    int mapWidth = 0;
    int mapHeight = 0;

public:
    App(int initialSeed = 10101010){
        std::cout << "App: Игровая логика инициализирована с сидом: " << initialSeed << std::endl;
        inputProcessor.init();
        for(int i = 0; i < INPUT_BUFFER_SIZE; ++i) {
            sharedInputState[i] = 0;
        }
    }
    
    ~App() {
    }

    void generateMapFromImage(uintptr_t rgbaPtr, int width, int height){
        mapLoader.generateFromImageData(rgbaPtr, width, height);
    }

    uintptr_t getMapDataPtr() const {
        return mapLoader.getMapDataPtr();
    }
    int getMapWidth() const { return mapLoader.getMapWidth(); }
    int getMapHeight() const { return mapLoader.getMapHeight(); }

    void handleInput(){
        // ...
    }

    void update(float deltaTime){
        inputProcessor.processMovement(deltaTime);
        updateCounter++;
    }

    static uintptr_t getSharedInputPtr() {
        return (uintptr_t)sharedInputState;
    }
};

EMSCRIPTEN_BINDINGS(core_app) {
    class_<App>("App")
        .constructor<int>()
        .function("update", &App::update) 
        .function("input", &App::handleInput)
        .function("generateMapFromImage", &App::generateMapFromImage)
        
        .function("generateMapFromImage", &App::generateMapFromImage) 
        .function("getMapDataPtr", &App::getMapDataPtr)
        .function("getMapWidth", &App::getMapWidth)
        .function("getMapHeight", &App::getMapHeight)
        ;
        
    emscripten::function("getSharedInputPtr", &App::getSharedInputPtr);
}
