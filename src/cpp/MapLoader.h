#pragma once

#include <vector>
#include <cstdint>
#include <iostream>
#include <algorithm>

enum class TileType : uint8_t {
    WALKABLE = 0, 
    OBSTACLE = 1,
    WATER = 2
};

class MapLoader {
private:
    std::vector<uint8_t> mapData;
    int mapWidth = 0;
    int mapHeight = 0;

public:
    MapLoader() = default;

    void generateFromImageData(uintptr_t rgbaDataPtr, int width, int height) {
        std::cout << "C++ MapLoader: Начинаю обработку изображения " 
                  << width << "x" << height << "..." << std::endl;
        if (width <= 0 || height <= 0) {
            std::cout << "C++ MapLoader: Ошибка - неверные размеры." << std::endl;
            return;
        }
        mapWidth = width;
        mapHeight = height;
        mapData.resize(width * height);
        const uint8_t* rgbaData = reinterpret_cast<const uint8_t*>(rgbaDataPtr);
        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                const int rgbaIndex = (y * width + x) * 4;
                const uint8_t redChannel = rgbaData[rgbaIndex];
                const int mapIndex = y * width + x;
                if (redChannel < 10) { 
                    mapData[mapIndex] = static_cast<uint8_t>(TileType::OBSTACLE);
                } else { 
                    mapData[mapIndex] = static_cast<uint8_t>(TileType::WALKABLE);
                }
            }
        }
        std::cout << "C++ MapLoader: Карта успешно сгенерирована из пиксельных данных. Размер: " 
                  << width << "x" << height << std::endl;
    }
    uintptr_t getMapDataPtr() const {
        return reinterpret_cast<uintptr_t>(mapData.data());
    }

    int getMapWidth() const { return mapWidth; }
    int getMapHeight() const { return mapHeight; }
    
    const std::vector<uint8_t>& getMapData() const {
        return mapData;
    }
};

