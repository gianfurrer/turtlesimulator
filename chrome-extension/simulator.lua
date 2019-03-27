if not turtle then

    turtle = {}

    blocks = {}

    local defaultBlock = "minecraft:cobblestone"

    inventory = { { name = "minecraft:coal_block", count = 64 }, { name = "minecraft:coal_block", count = 64 },
                            { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 },
                            { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 },
                            { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 }, { name = "", count = 0 },
                            { name = "", count = 0 }, { name = "", count = 0 } }

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
        print("[setFuelLevel] " .. value) 
    end
    function setSelectedSlot(value) 
        selectedSlot = value 
        print("[setSelectedSlot] " .. value) 
    end

    turtle.getSelectedSlot = function ()
            return selectedSlot 
    end
    turtle.select = function (slot)
        if slot < 1 or slot > 16 then
            return false
        end
        setSelectedSlot(slot)
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
            error("No fuel") 
        end  
        setFuelLevel(fuelLevel - 1)
        success = not detectFunction()
        if success then print("[" .. functionName .. "]") end
        return success
    end

    turtle.forward = function () return moveBase(turtle.detect, "forward") end
    turtle.up = function () return moveBase(turtle.detectUp, "up") end
    turtle.down = function () return moveBase(turtle.detectDown, "down") end
    turtle.back = function () return moveBase(detectBack, "back") end
    turtle.turnLeft = function () print("[turnLeft]") return true end
    turtle.turnRight = function () print("[turnRight]") return true end

    function digBase(inspectFunction, getCoordinatesFunction, functionName)
        local success, data = inspectFunction()
        if not success then
            return false 
        end
        local x, y, z = getCoordinatesFunction()
        addBlock("minecraft:air", x, y, z)
        addItemToInventory(data.name)
        return true
    end

    turtle.dig = function () return digBase(turtle.inspect, getCoordinatesInFront, "dig") end
    turtle.digUp = function () return digBase(turtle.inspectUp, getCoordinatesAbove, "digUp") end
    turtle.digDown = function () return digBase(turtle.inspectDown, getCoordinatesBeneath, "digDown") end

        function detectBase(inspectFunction, functionName) 
            local success, data = inspectFunction()
            return success
        end

    turtle.detect = function () return detectBase(turtle.inspect, "detect") end
    turtle.detectUp = function () return detectBase(turtle.inspectUp, "detectUp") end
    turtle.detectDown = function () return detectBase(turtle.inspectDown, "detectDown") end
    function detectBack() return detectBase(inspectBack, "inspectBack") end

    function inspectBase(getCoordinatesFunction, functionName)
        local x, y, z = getCoordinatesFunction()
        local success, name = getBlockAtCoordinates(x, y, z)
        return success, { name = name }
    end

    turtle.inspect = function () return inspectBase(getCoordinatesInFront, "inspect") end
    turtle.inspectUp = function () return inspectBase(getCoordinatesAbove, "inspectUp") end
    turtle.inspectDown = function () return inspectBase(getCoordinatesBeneath, "inspectDown") end
    function inspectBack() return inspectBase(getCoordinatesBehind, "inspectBack") end

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

    turtle.drop = function (count) 
        count = count or inventory[selectedSlot].count 
        if count > inventory[selectedSlot].count  then
            count = inventory[selectedSlot].count 
        end
        print("[drop] " .. count)
        return true
    end
    turtle.dropUp = function (count) 
        return turtle.drop(count)
    end
    turtle.dropDown = function (count) 
        return turtle.drop(count)
    end

    function addBlock(name, x, y, z)
        for i = 1, #blocks do
            local block = blocks[i]
            if block.x == x and block.y == y and block.z == z then
                table.remove(blocks, i)
            end
        end
        table.insert(blocks, { name = name, x = x, y = y, z = z })
        print("[addBlock] " .. name .. " " .. x .. " " .. y .. " " .. z)
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
        for i = 1, 16 do
            if inventory[i].count < 64 and inventory[i].name == name then
                inventory[i].count = inventory[i].count + 1
                print("[addItemToInventory] " .. name .. " " ..i)
                return true
            end
        end
        for i = 1, 16 do
            if inventory[i].count == 0 then
                inventory[i].name = name
                inventory[i].count = 1
                print("[addItemToInventory] " .. name .. " " .. i)
                return true
            end
        end
        return false
    end

    function removeItemFromInventory(quantity)
        quantity = quantity or turtle.getItemCount()
        if quantity > turtle.getItemCount() then quantity = turtle.getItemCount() end
        inventory[selectedSlot].count = inventory[selectedSlot].count - quantity
        print("[removeItemFromInventory] " .. quantity)
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
            if direction == directionEnum.forward then currentZ = currentZ + 1
            elseif direction == directionEnum.back then currentZ = currentZ - 1
            elseif direction == directionEnum.left then currentX = currentX - 1
            elseif direction == directionEnum.right then currentX = currentX + 1 end
        end 
    end
    turtle.back = function ()
        if back() then
            if direction == directionEnum.forward then currentZ = currentZ - 1
            elseif direction == directionEnum.back then currentZ = currentZ + 1
            elseif direction == directionEnum.left then currentX = currentX + 1
            elseif direction == directionEnum.right then currentX = currentX - 1 end
        end
    end
    turtle.up = function () 
        if up() then 
            currentY = currentY + 1
        end 
    end
    turtle.down = function () 
        if down() then 
            currentY = currentY - 1
        end 
    end
    turtle.turnLeft = function () 
        if turnLeft() then 
            if currentDirection == directionEnum.right then currentDirection = directionEnum.forward
            else currentDirection = currentDirection + 1 end
        end 
    end
    turtle.turnRight = function () 
        if turnRight() then
            if currentDirection == directionEnum.forward then currentDirection = directionEnum.right
            else currentDirection = currentDirection - 1 end
        end 
    end

    function getCoordinatesInFront()
        local x, y, z
        if currentDirection == directionEnum.forward then z = currentZ + 1
        elseif currentDirection == directionEnum.back then z = currentZ - 1
        elseif currentDirection == directionEnum.right then x = currentX + 1
        elseif currentDirection == directionEnum.left then x = currentX - 1 end
        return x, y, z
    end

    function getCoordinatesBehind()
        local x, y, z
        if currentDirection == directionEnum.forward then z = currentZ - 1
        elseif currentDirection == directionEnum.back then z = currentZ + 1
        elseif currentDirection == directionEnum.right then x = currentX - 1
        elseif currentDirection == directionEnum.left then x = currentX + 1 end
        return x, y, z
    end

    function getCoordinatesAbove()
        return currentX, currentY + 1, currentZ
    end

    function getCoordinatesBeneath()
        return currentX, currentY - 1, currentZ
    end

    function turnToDirection(targetDirection)
        directionDifference = direction - targetDirection
        if directionDifference > 0 then 
            for i = 1, directionDifference do turtle.turnRight() end
        else
            for i = directionDifference, -1 do turtle.turnLeft() end
        end
    end

    function goToCoordinates(targetX, targetY, targetZ, targetDirection)
        targetDirection = targetDirection or currentDirection
        targetX = targetX or 0 targetY = targetY or 0 targetZ = targetZ or 0
        local differenceX, differenceY, differenceZ = currentX - targetX, currentY - targetY, currentZ - targetZ

        if differenceY > 0 then
            for i = 1, differenceY do turtle.digDown() turtle.down() end
        else
            for i = differenceY, -1 do turtle.digUp() turtle.up() end
        end

        previousDirection = currentDirection
        if differenceX > 0 then
            turnToDirection(directionEnum.left)
            for i = 1, differenceX do turtle.dig() turtle.forward() end
            turnToDirection(previousDirection)
        else
            turnToDirection(directionEnum.right)
            for i = differenceX, -1 do turtle.dig() turtle.forward() end
            turnToDirection(previousDirection)
        end

        if differenceZ > 0 then
            turnToDirection(directionEnum.back)
            for i = 1, differenceZ do turtle.dig() turtle.forward() end
            turnToDirection(previousDirection)
        else
            turnToDirection(directionEnum.forward)
            for i = differenceZ, -1 do turtle.dig() turtle.forward() end
            turnToDirection(previousDirection)
        end

        turnToDirection(targetDirection)
    end
end