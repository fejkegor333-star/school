// ================================================================================
// ⚠️ ВНИМАНИЕ: НЕ РЕДАКТИРОВАТЬ БЕЗ СОГЛАСИЯ!
// ================================================================================
// УЛУЧШЕННАЯ ЛОГИКА ПОСТРОЕНИЯ МАРШРУТОВ
// 
// Функции:
// - Построение маршрутов между этажами через лестницы
// - Учёт изолированных корпусов (здания без прямого выхода)
// - Автоматический выбор лестниц по stairId
// - Проверка зон корпусов
//
// Любые изменения должны быть согласованы!
// ================================================================================

/**
 * Проверить, находится ли точка в зоне изолированного корпуса
 */
function isPointInIsolatedZone(x, y, floor) {
    if (typeof buildingZones === 'undefined') return null;
    
    for (const zone of buildingZones) {
        if (zone.floor !== floor) continue;
        if (x >= zone.x && x <= zone.x + zone.width &&
            y >= zone.y && y <= zone.y + zone.height) {
            return zone;
        }
    }
    return null;
}

/**
 * Проверить, является ли этаж изолированным в данной зоне
 */
function isFloorIsolatedInZone(zone, floor) {
    return zone.isolatedFloors && zone.isolatedFloors.includes(floor);
}

/**
 * Проверить, находится ли объект в изолированном корпусе
 */
function isObjectInIsolatedBuilding(obj) {
    const objCenter = {
        x: obj.x + obj.width / 2,
        y: obj.y + obj.height / 2
    };
    
    const zone = isPointInIsolatedZone(objCenter.x, objCenter.y, obj.floor);
    if (zone && isFloorIsolatedInZone(zone, obj.floor)) {
        return { zone: zone, isIsolated: true };
    }
    
    return { zone: zone, isIsolated: false };
}

/**
 * Проверить, есть ли лестница с данным stairId на всех этажах маршрута
 */
function isStairIdValidForRoute(stairId, floors) {
    for (const floor of floors) {
        const stairOnFloor = objects.find(o =>
            o.type === 'stairs' &&
            o.stairId === stairId &&
            o.floor === floor
        );
        if (!stairOnFloor) {
            return false;
        }
    }
    return true;
}

/**
 * Получить валидные stairId для объекта, которые работают на всех этажах маршрута
 */
function getValidStairIdsForObject(obj, allFloors) {
    let stairIds = [];
    if (obj.connectedStairIds && obj.connectedStairIds.length > 0) {
        stairIds = obj.connectedStairIds;
    } else if (obj.connectedStairId) {
        stairIds = [obj.connectedStairId];
    }

    // Фильтруем stairId, которые есть на всех этажах маршрута
    return stairIds.filter(id => isStairIdValidForRoute(id, allFloors));
}
