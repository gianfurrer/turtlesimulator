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
    end

    -- inventory functions 
    do 
        turtle.getSelectedSlot = function ()
             return selectedSlot 
        end
        turtle.select = function (slot)
            if slot < 1 or slot > 16 then
                return false
            end
            selectedSlot = slot 
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
    end

    -- fuel functions
    do
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
            
            turtle.drop(quantity)
            local fuelLevel = (fuelLevel + (quantity * fuelItems[name]))
            if fuelLevel > fuelLimit then setFuelLevel(fuelLimit) else setFuelLevel(fuelLevel) end
            return true
        end
    end

    -- movement functions
    do
        function moveBase(detectFunction, functionName)
            if fuelLevel < 1 then 
                error("No fuel") 
            end  
            setFuelLevel(fuelLevel - 1)
            success = not detectFunction()
            return success
        end

        turtle.forward = function () return moveBase(turtle.detect, "forward") end
        turtle.up = function () return moveBase(turtle.detectUp, "up") end
        turtle.down = function () return moveBase(turtle.detectDown, "down") end
        turtle.back = function () return moveBase(detectBack, "back") end
        turtle.turnLeft = function () return true end
        turtle.turnRight = function () return true end
    end

    -- dig functions
    do 
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
    end

    -- detect functions
    do
        function detectBase(inspectFunction, functionName) 
            local success, data = inspectFunction()
            return success
        end

        turtle.detect = function () return detectBase(turtle.inspect, "detect") end
        turtle.detectUp = function () return detectBase(turtle.inspectUp, "detectUp") end
        turtle.detectDown = function () return detectBase(turtle.inspectDown, "detectDown") end
        function detectBack() return detectBase(inspectBack, "inspectBack") end
    end

    -- inspect functions
    do

        function inspectBase(getCoordinatesFunction, functionName)
            local x, y, z = getCoordinatesFunction()
            local success, name = getBlockAtCoordinates(x, y, z)
            return success, { name = name }
        end

        turtle.inspect = function () return inspectBase(getCoordinatesInFront, "inspect") end
        turtle.inspectUp = function () return inspectBase(getCoordinatesAbove, "inspectUp") end
        turtle.inspectDown = function () return inspectBase(getCoordinatesBeneath, "inspectDown") end
        function inspectBack() return inspectBase(getCoordinatesBehind, "inspectBack") end
    end

    -- place functions
    do
        function placeBase(detectFunction, getCoordinatesFunction)
            if detectFunction() or turtle.getItemCount() == 0 then 
                return false
            end
            local x, y, z = getCoordinatesFunction()
            addBlock(inventory[selectedSlot].name, x, y, z)
            inventory[selectedSlot].count = inventory[selectedSlot].count - 1
            return true
        end

        turtle.place = function () return placeBase(turtle.detect, getCoordinatesInFront) end
        turtle.placeUp = function () return placeBase(turtle.detectUp, getCoordinatesAbove) end
        turtle.placeDown = function () return placeBase(turtle.detectDown, getCoordinatesBeneath) end
    end

    -- drop functions
    do
        turtle.drop = function (count) 
            count = count or inventory[selectedSlot].count 
            if count > inventory[selectedSlot].count  then
                count = inventory[selectedSlot].count 
            end
            print("[drop] " .. count .. " " .. tostring(true))
            return true
        end
        turtle.dropUp = function (count) 
            return turtle.drop(count)
        end
        turtle.dropDown = function (count) 
            return turtle.drop(count)
        end
    end

    -- utility functions
    do
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
                    print("[getBlockAtCoordinates] " .. x .. " " .. y .. " " .. z .. " " .. tostring(block.name ~= "minecraft:air") .. " " .. block.name)
                    return block.name ~= "minecraft:air", block.name
                end
            end
            print("[getBlockAtCoordinates] " .. x .. " " .. y .. " " .. z .. " " .. tostring(true) .. " ".. defaultBlock)
            return true, defaultBlock
        end

        function addItemToInventory(name) 
            for i = 1, 16 do
                if inventory[i].count < 64 and inventory[i].name == name then
                    inventory[i].count = inventory[i].count + 1
                    print("[addItemToInventory] " .. name .. " " .. tostring(true) .. " " ..i)
                    return true
                end
            end
            for i = 1, 16 do
                if inventory[i].count == 0 then
                    inventory[i].name = name
                    inventory[i].count = 1
                    print("[addItemToInventory] " .. name .. " " .. tostring(true) .. " " .. i)
                    return true
                end
            end
            print("[addItemToInventory] " .. name .. " " .. tostring(false))
            return false
        end
    end

    -- Coordinate recording / discovery
    do 
        directionEnum = { forward = 1, left = 2, back = 3, right = 4, up = 5, down = 6 }
        local movements = { }

        local forward = turtle.forward
        local up = turtle.up
        local down = turtle.down
        local turnLeft = turtle.turnLeft
        local turnRight = turtle.turnRight

        turtle.forward = function () forward() table.insert(movements, directionEnum.forward) end
        turtle.up = function () up() table.insert(movements, directionEnum.up) end
        turtle.down = function () down() table.insert(movements, directionEnum.down) end
        turtle.turnLeft = function () turnLeft() table.insert(movements, directionEnum.left) end
        turtle.turnRight = function () turnRight() table.insert(movements, directionEnum.right) end

        function getCoordinates()
            local x, y, z = 0, 0, 0
            local direction = directionEnum.forward

            for i = 1, #movements do
                local movement = movements[i]
                if movement == directionEnum.left then
                    if direction == directionEnum.right then direction = directionEnum.forward
                    else direction = direction + 1 end
                elseif movement == directionEnum.right then
                    if direction == directionEnum.forward then direction = directionEnum.right
                    else direction = direction - 1 end
                elseif movement == directionEnum.up then y = y + 1
                elseif movement == directionEnum.down then y = y - 1
                elseif movement == directionEnum.forward then
                    if direction == directionEnum.forward then z = z + 1
                    elseif direction == directionEnum.left then x = x - 1
                    elseif direction == directionEnum.back then z = z - 1
                    elseif direction == directionEnum.right then x = x + 1 end
                end
            end

            return x, y, z, direction
        end

        function getCoordinatesInFront()
            local x, y, z, direction = getCoordinates()
            if direction == directionEnum.forward then z = z + 1
            elseif direction == directionEnum.back then z = z - 1
            elseif direction == directionEnum.right then x = x + 1
            elseif direction == directionEnum.left then x = x - 1 end
            return x, y, z
        end

        function getCoordinatesAbove()
            local x, y, z, direction = getCoordinates()
            y = y + 1
            return x, y, z
        end

        function getCoordinatesBeneath()
            local x, y, z, direction = getCoordinates()
            y = y - 1
            return x, y, z
        end

        function getCoordinatesBehind()
            local x, y, z, direction = getCoordinates()
            if direction == directionEnum.forward then z = z - 1
            elseif direction == directionEnum.back then z = z + 1
            elseif direction == directionEnum.right then x = x - 1
            elseif direction == directionEnum.left then x = x + 1 end
            return x, y, z
        end

        function turnToDirection(currentDirection, targetDirection)
            directionDifference = currentDirection - targetDirection
            if directionDifference > 0 then 
                for i = 1, directionDifference do turtle.turnRight() end
            else
                for i = directionDifference, -1 do turtle.turnLeft() end
            end
        end

        function goToCoordinates(x, y, z, direction)
            direction = direction or directionEnum.forward
            x = x or 0 y = y or 0 z = z or 0 
            local currentX, currentY, currentZ, currentDirection = getCoordinates()
            local differenceX, differenceY, differenceZ = currentX - x, currentY - y, currentZ - z

            if differenceY > 0 then
                for i = 1, differenceY do turtle.digDown() turtle.down() end
            else
                for i = differenceY, -1 do turtle.digUp() turtle.up() end
            end

            if differenceX > 0 then 
                turnToDirection(currentDirection, directionEnum.left)
                for i = 1, differenceX do turtle.dig() turtle.forward() end
                turnToDirection(directionEnum.left, currentDirection)
            else
                turnToDirection(currentDirection, directionEnum.right)
                for i = differenceX, -1 do turtle.dig() turtle.forward() end
                turnToDirection(directionEnum.right, currentDirection)
            end

            if differenceZ > 0 then 
                turnToDirection(currentDirection, directionEnum.back)
                for i = 1, differenceZ do turtle.dig() turtle.forward() end
                turnToDirection(directionEnum.back, currentDirection)
            else
                turnToDirection(currentDirection, directionEnum.forward)
                for i = differenceZ, -1 do turtle.dig() turtle.forward() end
                turnToDirection(directionEnum.forward, currentDirection)
            end

            turnToDirection(currentDirection, direction)
        end
    end
end
