#!/bin/bash
RESOURCE_DIR="./public/resources"
PUBLIC_ROOT="./public/resources"

if [ ! -d "$RESOURCE_DIR" ]; then
    echo "Ошибка: Директория ресурсов $RESOURCE_DIR не найдена по пути: $RESOURCE_DIR"
    exit 1
fi

echo "--- Начинаю архивацию ресурсов ---"
find "$PUBLIC_ROOT" -maxdepth 1 -type f -name "*.zip" -delete
echo "Старые ZIP-архивы в корне $PUBLIC_ROOT удалены."
FOUND_DIRS=0
while read DIR
do
    FOUND_DIRS=$((FOUND_DIRS + 1))
    echo "НАЙДЕНА ПАПКА: $DIR"
    BASE_NAME=$(basename "$DIR")
    ARCHIVE_NAME="$PUBLIC_ROOT/$BASE_NAME.zip"
    echo "Упаковываю '$BASE_NAME' в '$ARCHIVE_NAME'..."
    7z a -tzip -r -mx=5 "$ARCHIVE_NAME" "$DIR/*"
    if [ $? -eq 0 ]; then
        echo "Успешно: $BASE_NAME.zip создан."
    else
        echo "ОШИБКА: Не удалось создать архив для $BASE_NAME. Код выхода: $?."
    fi
done < <(find "$RESOURCE_DIR" -mindepth 1 -maxdepth 1 -type d)
if [ "$FOUND_DIRS" -eq 0 ]; then
    echo "ПРЕДУПРЕЖДЕНИЕ: Внутри $RESOURCE_DIR не найдено ни одной поддиректории для архивации."
    echo "Проверьте, что у вас есть папки, например: public/resources/event_1/."
else
    echo "Всего архивов создано: $FOUND_DIRS"
fi
echo "--- Архивация завершена ---"
