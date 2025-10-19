SRC_DIR="./src/cpp" 
BUILD_DIR="./src/wasm" 
OUTPUT_NAME="core_app"

mkdir -p $BUILD_DIR

echo "Compiling C++ to WebAssembly..."
emcc $SRC_DIR/*.cpp -o $BUILD_DIR/$OUTPUT_NAME.js \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="WasmModule" \
    -s EXPORT_ES6=1 \
    -s WASM=1 \
    --bind \
    -s ALLOW_MEMORY_GROWTH=1 \
    -O3 \
    -s MALLOC="dlmalloc" \
    -s 'EXPORTED_RUNTIME_METHODS=["HEAPU8", "HEAP32"]' \
    -s 'EXPORTED_FUNCTIONS=["_malloc", "_free"]' \

echo "Compilation successful: $BUILD_DIR/$OUTPUT_NAME.js and .wasm created."
