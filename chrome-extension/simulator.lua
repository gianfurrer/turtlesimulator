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

    -- inventory functions 
    do 
        turtle.getSelectedSlot = function ()
             print("[getSelectedSlot] " .. selectedSlot)
             return selectedSlot 
        end
        turtle.select = function (slot)
            if slot < 1 or slot > 16 then
                print("[select] " .. slot .. " " .. tostring(false))
                return false
            end
            selectedSlot = slot 
            print("[select] " .. slot .. " " .. tostring(true))
            return true
        end
        turtle.getItemCount = function (slot) 
            slot = slot or turtle.getSelectedSlot()
            local count = inventory[slot].count
            print("[getItemCount] " .. slot .. " " .. count)
            return count
        end
        turtle.getItemDetail = function (slot)
            slot = slot or turtle.getSelectedSlot()
            local name, count = inventory[slot].name, inventory[slot].count
            print("[getItemDetail] " .. slot .. " " .. name .. " " .. count)
            return { name = name, count = count }
        end
    end

    -- fuel functions
    do
        turtle.getFuelLevel = function () 
            print("[getFuelLevel] " .. fuelLevel)
            return fuelLevel 
        end
        turtle.getFuelLimit = function () 
            print("[getFuelLimit] " .. fuelLimit)
            return fuelLimit 
        end
        turtle.refuel = function (quantity)
            quantity = quantity or turtle.getItemCount()
            local name = inventory[turtle.getSelectedSlot()].name
            if not fuelItems[name] then
                print("[refuel] " .. quantity .. " " .. tostring(false))
                return false
            end

            if quantity > turtle.getItemCount() then
                quantity = turtle.getItemCount()
            end
            
            inventory[turtle.getSelectedSlot()].count = inventory[turtle.getSelectedSlot()].count - quantity
            fuelLevel = fuelLevel + (quantity * fuelItems[name])
            if turtle.getFuelLevel() > turtle.getFuelLimit() then 
                fuelLevel = fuelLimit
            end
            print("[refuel] " .. quantity .. " " .. tostring(true))
            return true
        end
    end

    -- movement functions
    do
        turtle.forward = function () 
            if fuelLevel < 1 then 
                error("No fuel") 
            end  
            fuelLevel = fuelLevel - 1 
            success = not turtle.detect()
            print("[forward] " .. tostring(success))
            return success
        end
        turtle.back = function ()  
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            return true 
        end
        turtle.up = function () 
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            success = not turtle.detectUp()
            print("[up] " .. tostring(success))
            return success
        end
        turtle.down = function ()
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            success = not turtle.detectDown()
            print("[down] " .. tostring(success))
            return success
        end
        turtle.turnLeft = function () 
            print("[turnLeft] " .. tostring(true))
            return true 
        end
        turtle.turnRight = function () 
            print("[turnRight] " .. tostring(true))
            return true 
        end
    end

    -- dig functions
    do 
        turtle.dig = function () 
            local success, data = turtle.inspect()
            if not success then
                print("[dig] " .. tostring(false))
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesInFront()
            addBlock("minecraft:air", x, y, z)
            print("[dig] " .. tostring(true))
            return true
        end
        turtle.digUp = function () 
            local success, data = turtle.inspectUp()
            if not success then
                print("[digUp] " .. tostring(false))
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesAbove()
            addBlock("minecraft:air", x, y, z)
            print("[digUp] " .. tostring(true))
            return true
        end
        turtle.digDown = function () 
            local success, data = turtle.inspectDown()
            if not success then 
                print("[digDown] " .. tostring(false))
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesBeneath()
            addBlock("minecraft:air", x, y, z)
            print("[digDown] " .. tostring(true))
            return true
        end
    end

    -- detect functions
    do
        turtle.detect = function () 
            local success, data = turtle.inspect()
            print("[detect] " .. tostring(success))
            return success
        end
        turtle.detectUp = function ()
            local success, data = turtle.inspectUp()
            print("[detectUp] " .. tostring(success))
            return success
        end
        turtle.detectDown = function ()
            local success, data = turtle.inspectDown()
            print("[detectDown] " .. tostring(success))
            return success
        end
    end

    -- inspect functions
    do
        turtle.inspect = function ()
            local x, y, z = getCoordinatesInFront()
            local success, name = getBlockAtCoordinates(x, y, z)
            print("[inspect] " .. tostring(success) .. " " .. name)
            return success, { name = name }
        end
        turtle.inspectUp = function ()
            local x, y, z = getCoordinatesAbove()
            local success, name = getBlockAtCoordinates(x, y, z)
            print("[inspectUp] " .. tostring(success) .. " " .. name)
            return success, { name = name }
        end
        turtle.inspectDown = function () 
            local x, y, z = getCoordinatesBeneath()
            local success, name = getBlockAtCoordinates(x, y, z)
            print("[inspectDown] " .. tostring(success) .. " " .. name)
            return success, { name = name }
        end
    end

    -- place functions
    do
        turtle.place = function ()
            if not turtle.detect() or turtle.getItemCount() == 0 then 
                print("[place] " .. tostring(false))
                return false
            end
            local x, y, z = getCoordinatesInFront()
            addBlock(turtle.getItemDetail().name, x, y, z)
            inventory.slot[turtle.getSelectedSlot()].count = inventory.slot[turtle.getSelectedSlot()].count - 1
            print("[place] " .. tostring(true))
            return true
        end
        turtle.placeUp = function ()
            if not turtle.detectUp() or turtle.getItemCount() == 0 then 
                print("[placeUp] " .. tostring(false))
                return false
            end
            local x, y, z = getCoordinatesAbove()
            addBlock(turtle.getItemDetail().name, x, y, z)
            inventory.slot[turtle.getSelectedSlot()].count = inventory.slot[turtle.getSelectedSlot()].count - 1
            print("[placeUp] " .. tostring(true))
            return true
        end
        turtle.placeDown = function ()
            if not turtle.detectDown() or turtle.getItemCount() == 0 then 
                print("[placeDown] " .. tostring(false))
                return false
            end
            local x, y, z = getCoordinatesBeneath()
            addBlock(turtle.getItemDetail().name, x, y, z)
            inventory.slot[turtle.getSelectedSlot()].count = inventory.slot[turtle.getSelectedSlot()].count - 1
            print("[placeDown] " .. tostring(true))
            return true
        end
    end

    -- drop functions
    do
        turtle.drop = function (count) 
            count = count or turtle.getItemCount() 
            if count > turtle.getItemCount() then
                count = turtle.getItemCount()
            end
            inventory[turtle.getSelectedSlot()].count = inventory[turtle.getSelectedSlot()].count - count
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
                if turtle.getItemCount(i) < 64 and inventory[i].name == name then
                    inventory[i].count = inventory[i].count + 1
                    print("[addItemToInventory] " .. name .. " " .. tostring(true) .. " " ..i)
                    return true
                end
            end
            for i = 1, 16 do
                if turtle.getItemCount(i) == 0 then
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
