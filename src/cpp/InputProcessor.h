#pragma once
#include <iostream>
#include <cstdint>
#include "InputKeys.h"

extern int sharedInputState[4];

class InputProcessor{
    public:
        InputProcessor() = default;

    void init(){
        
    }
    void processMovement(float deltaTime) const {
        std::string movement = "";
        if (sharedInputState[static_cast<int>(InputKeys::KEY_W)] == 1) {
            movement += "W ";
        }
        if (sharedInputState[static_cast<int>(InputKeys::KEY_A)] == 1) {
            movement += "A ";
        }
        if (sharedInputState[static_cast<int>(InputKeys::KEY_S)] == 1) {
            movement += "S ";
        }
        if (sharedInputState[static_cast<int>(InputKeys::KEY_D)] == 1) {
            movement += "D ";
        }

        if (!movement.empty()) {
            std::cout << "C++ InputProcessor: Движение WASD - " << movement << " (Delta: " << deltaTime << ")" << std::endl;
        }
    }

};