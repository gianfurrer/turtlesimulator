math.randomseed(os.time())
math.random() math.random() math.random()

local turtle = {}

local blocks = {}

local inventory = {}

local droppedItems = {}

local items = {}

local defaultBlock = "minecraft:stone"

local slotCount = 16

local fuelItems = { }
fuelItems["minecraft:blaze_rod"] = 120
fuelItems["minecraft:coal"] = 80
fuelItems["minecraft:coal_block"] = 720
fuelItems["minecraft:lava_bucket"] = 1000
fuelItems["minecraft:brown_mushroom_block"] = 15
fuelItems["minecraft:red_mushroom_block"] = 15
fuelItems["minecraft:stick"] = 5
fuelItems["minecraft:reeds"] = 0
fuelItems["minecraft:planks"] = 15

local fuelLevel = 0
local fuelLimit = 20000
local selectedSlot = 1


function setFuelLevel(value)
    fuelLevel = value
    printOutput({ "[setFuelLevel]", fuelLevel })
end

turtle.getSelectedSlot = function ()
    return selectedSlot
end
turtle.select = function (slot)
    if slot < 1 or slot > slotCount then
        return false
    end
    selectedSlot = slot
    printOutput({ "[select]", selectedSlot })
    return true
end
turtle.getItemCount = function (slot)
    slot = slot or selectedSlot
    local count = inventory[slot].count
    return count
end
turtle.getItemDetail = function (slot)
    slot = slot or selectedSlot
    local name, count = inventory[slot].name, inventory[slot].count
    return { name = name, count = count }
end

turtle.getFuelLevel = function ()
    return fuelLevel
end
turtle.getFuelLimit = function ()
    return fuelLimit
end
turtle.refuel = function (quantity)
    quantity = quantity or inventory[selectedSlot].count
    local name = inventory[selectedSlot].name
    if not fuelItems[name] then
        return false
    end

    if quantity > inventory[selectedSlot].count then
        quantity = inventory[selectedSlot].count
    end

    removeItemFromInventory(quantity)
    local fuelLevel = (fuelLevel + (quantity * fuelItems[name]))
    if fuelLevel > fuelLimit then setFuelLevel(fuelLimit) else setFuelLevel(fuelLevel) end
    return true
end

function moveBase(detectFunction, functionName)
    if fuelLevel < 1 then
        printOutput({ "[error]", "No fuel" })
        return false
    end
    local success = not detectFunction()
    if success then setFuelLevel(fuelLevel - 1) end
    return success
end

turtle.forward = function () return moveBase(turtle.detect) end
turtle.up = function () return moveBase(turtle.detectUp) end
turtle.down = function () return moveBase(turtle.detectDown) end
turtle.back = function () return moveBase(detectBack) end
turtle.turnLeft = function () return true end
turtle.turnRight = function () return true end

function digBase(inspectFunction, getCoordinatesFunction)
    local success, data = inspectFunction()
    if not success then
        return false
    end
    local x, y, z = getCoordinatesFunction()
    addBlock("minecraft:air", x, y, z)

    local item = tableFirstOrNil(items, function (i) return i.value == data.name end)
    quantity = math.random(item.minDropCount, item.maxDropCount)
    for i=1, quantity do
        addItemToInventory(item.drops)
    end
    return true
end

turtle.dig = function () return digBase(turtle.inspect, getCoordinatesInFront) end
turtle.digUp = function () return digBase(turtle.inspectUp, getCoordinatesAbove) end
turtle.digDown = function () return digBase(turtle.inspectDown, getCoordinatesBeneath) end

function detectBase(inspectFunction)
    local success, data = inspectFunction()
    return success
end

turtle.detect = function () return detectBase(turtle.inspect) end
turtle.detectUp = function () return detectBase(turtle.inspectUp) end
turtle.detectDown = function () return detectBase(turtle.inspectDown) end
function detectBack() return detectBase(inspectBack) end

function inspectBase(getCoordinatesFunction)
    local x, y, z = getCoordinatesFunction()
    local success, name = getBlockAtCoordinates(x, y, z)
    return success, { name = name }
end

turtle.inspect = function () return inspectBase(getCoordinatesInFront) end
turtle.inspectUp = function () return inspectBase(getCoordinatesAbove) end
turtle.inspectDown = function () return inspectBase(getCoordinatesBeneath) end
function inspectBack() return inspectBase(getCoordinatesBehind) end

function placeBase(detectFunction, getCoordinatesFunction)
    if detectFunction() or turtle.getItemCount() == 0 then
        return false
    end
    local x, y, z = getCoordinatesFunction()
    addBlock(inventory[selectedSlot].name, x, y, z)
    removeItemFromInventory(1)
    return true
end

turtle.place = function () return placeBase(turtle.detect, getCoordinatesInFront) end
turtle.placeUp = function () return placeBase(turtle.detectUp, getCoordinatesAbove) end
turtle.placeDown = function () return placeBase(turtle.detectDown, getCoordinatesBeneath) end


function dropBase(count, getCoordinatesFunction)
    local quantity, name = removeItemFromInventory(count)
    local x, y, z = getCoordinatesFunction()
    addDroppedItem(name, quantity, x, y, z)
    return true
end
turtle.drop = function (count)
    return dropBase(count, getCoordinatesInFront)
end
turtle.dropUp = function (count)
    return dropBase(count, getCoordinatesAbove)
end
turtle.dropDown = function (count)
    return dropBase(count, getCoordinatesBeneath)
end

function addDroppedItem(name, quantity, x, y, z)
    inserted = false
    for i=1,#droppedItems do
        local droppedItem = droppedItems[i]
        if droppedItem.name == name and droppedItem.x == x and droppedItem.y == y and droppedItem.z == z then
            droppedItem.quantity = droppedItem.quantity + quantity
            inserted = true;
        end
    end
    table.insert(droppedItems, { name = name, quantity = quantity, x = x, y = y, z = z })
end

function addBlock(name, x, y, z)
    inserted = false
    for i = 1, #blocks do
        local block = blocks[i]
        if block.x == x and block.y == y and block.z == z then
            blocks[i] = { name = name, x = x, y = y, z = z }
            inserted = true
        end
    end
    if not inserted then table.insert(blocks, { name = name, x = x, y = y, z = z }) end
    printOutput({ "[addBlock]", name, x, y, z })
end

function getBlockAtCoordinates(x, y, z)
    for i = 1, #blocks do
        local block = blocks[i]
        if block.x == x and block.y == y and block.z == z then
            return block.name ~= "minecraft:air", block.name
        end
    end
    return true, defaultBlock
end

function addItemToInventory(name)
    local item = tableFirstOrNil(items, function (i) return i.value == name end)
    local freeSlot = -1
    for i = 1, slotCount do
        if inventory[i].count < item.stackSize and inventory[i].name == name then
            inventory[i].count = inventory[i].count + 1
            printOutput({ "[addItemToInventory]", name, i })
            return true
        elseif freeSlot == -1 and inventory[i].count == 0 then
            freeSlot = i
        end
    end
    if freeSlot > -1 then
        inventory[freeSlot] = { name = name, count = 1 }
        printOutput({ "[addItemToInventory]", name, freeSlot })
        return true
    end
    return false
end

function removeItemFromInventory(quantity)
    quantity = quantity or turtle.getItemCount()
    local name = turtle.getItemDetail().name
    if quantity > turtle.getItemCount() then quantity = turtle.getItemCount() end
    inventory[selectedSlot].count = inventory[selectedSlot].count - quantity
    if inventory[selectedSlot].count < 1 then
        inventory[selectedSlot].name = ""
    end
    printOutput({ "[removeItemFromInventory]", quantity })
    return quantity, name
end

function printOutput(components)
    local output = os.time()
    for i = 1, #components do
        output = output .. " " .. components[i]
    end
    print(output)
end

directionEnum = { forward = 1, left = 2, back = 3, right = 4 }
currentDirection = directionEnum.forward
currentX = 0
currentY = 0
currentZ = 0

local forward = turtle.forward
local back = turtle.back
local up = turtle.up
local down = turtle.down
local turnLeft = turtle.turnLeft
local turnRight = turtle.turnRight

turtle.forward = function ()
    if forward() then
        if currentDirection == directionEnum.forward then currentZ = currentZ + 1
        elseif currentDirection == directionEnum.back then currentZ = currentZ - 1
        elseif currentDirection == directionEnum.left then currentX = currentX - 1
        elseif currentDirection == directionEnum.right then currentX = currentX + 1 end
        printOutput({ "[move]", currentX, currentY, currentZ })
        return true
    end
    return false
end
turtle.back = function ()
    if back() then
        if currentDirection == directionEnum.forward then currentZ = currentZ - 1
        elseif currentDirection == directionEnum.back then currentZ = currentZ + 1
        elseif currentDirection == directionEnum.left then currentX = currentX + 1
        elseif currentDirection == directionEnum.right then currentX = currentX - 1 end
        printOutput({ "[move]", currentX, currentY, currentZ })
        return true
    end
    return false
end
turtle.up = function ()
    if up() then
        currentY = currentY + 1
        printOutput({ "[move]", currentX, currentY, currentZ })
        return true
    end
    return false
end
turtle.down = function ()
    if down() then
        currentY = currentY - 1
        printOutput({ "[move]", currentX, currentY, currentZ })
        return true
    end
    return false
end
turtle.turnLeft = function ()
    if turnLeft() then
        if currentDirection == directionEnum.right then currentDirection = directionEnum.forward
        else currentDirection = currentDirection + 1 end
        printOutput({ "[turn]", currentDirection })
        return true
    end
    return false
end
turtle.turnRight = function ()
    if turnRight() then
        if currentDirection == directionEnum.forward then currentDirection = directionEnum.right
        else currentDirection = currentDirection - 1 end
        printOutput({ "[turn]", currentDirection })
        return true
    end
    return false
end

function getCoordinatesInFront()
    local x, y, z = currentX, currentY, currentZ
    if currentDirection == directionEnum.forward then z = z + 1
    elseif currentDirection == directionEnum.back then z = z - 1
    elseif currentDirection == directionEnum.left then x = x - 1
    elseif currentDirection == directionEnum.right then x = x + 1 end
    return x, y, z
end

function getCoordinatesBehind()
    local x, y, z = currentX, currentY, currentZ
    if currentDirection == directionEnum.forward then z = z - 1
    elseif currentDirection == directionEnum.back then z = z + 1
    elseif currentDirection == directionEnum.right then x = x - 1
    elseif currentDirection == directionEnum.left then x = x + 1 end
    return x, y, z
end

function getCoordinatesAbove()
    return currentX, currentY + 1, currentZ
end

function getCoordinatesBeneath()
    return currentX, currentY - 1, currentZ
end

function tableWhere(table, query)
    local results = {}
    for i=1,#table do
        if query(table[i]) then
            table.insert(results, table[i])
        end
    end
    return results
end

function tableFirstOrNil(table, query)
    for i=1,#table do
        if query(table[i]) then
            return table[i]
        end
    end
    return nil
end

function sleep(seconds)
    local endTime = os.time() + seconds
    repeat until os.time() > endTime
end
