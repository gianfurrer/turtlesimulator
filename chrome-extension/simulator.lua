if not turtle then

    turtle = {}

    blocks = {}
    local defaultBlock = "minecraft:cobblestone"

    local inventory = { { name = "minecraft:coal_block", count = 64 }, { name = "minecraft:coal_block", count = 64 },
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
        turtle.getSelectedSlot = function () return selectedSlot end
        turtle.select = function (slot) selectedSlot = slot end
        turtle.getItemCount = function (slot) 
            slot = slot or turtle.getSelectedSlot()
            return inventory[slot].count
        end
        turtle.getItemDetail = function (slot)
            slot = slot or turtle.getSelectedSlot()
            return { name = inventory[slot].name, count = inventory[slot].count }
        end
    end

    -- fuel functions
    do
        turtle.getFuelLevel = function () return fuelLevel end
        turtle.getFuelLimit = function () return fuelLimit end
        turtle.refuel = function (quantity)
            local name = inventory[turtle.getSelectedSlot()].name
            if not fuelItems[name] then
                return false
            end

            quantity = quantity or turtle.getItemCount()
            if quantity > turtle.getItemCount() then
                quantity = turtle.getItemCount()
            end

            
            inventory[turtle.getSelectedSlot()].count = inventory[turtle.getSelectedSlot()].count - quantity
            fuelLevel = fuelLevel + (quantity * fuelItems[name])
            if turtle.getFuelLevel() > turtle.getFuelLimit() then 
                fuelLevel = fuelLimit
            end
            return true
        end
    end

    -- movement functions
    do
        turtle.forward = function () 
            print('forward') 
            if fuelLevel < 1 then 
                error("No fuel") 
            end  
            fuelLevel = fuelLevel - 1 
            return not turtle.detect()
        end
        turtle.back = function () 
            print('back') 
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            return true 
        end
        turtle.up = function () 
            print('up') 
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            return not turtle.detectUp() 
        end
        turtle.down = function ()
            print('down') 
            if fuelLevel < 1 then 
                error("No fuel") 
            end 
            fuelLevel = fuelLevel - 1 
            return not turtle.detectDown() 
        end
        turtle.turnLeft = function () print('turn left') return true end
        turtle.turnRight = function () print('turn right') return true end
    end

    -- dig functions
    do 
        turtle.dig = function () 
            print('dig')
            local success, data = turtle.inspect()
            if not success then 
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesInFront()
            addBlock("minecraft:air", x, y, z)
            return true
        end
        turtle.digUp = function () 
            print('dig up')
            local success, data = turtle.inspectUp()
            if not success then 
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesAbove()
            addBlock("minecraft:air", x, y, z)
            return true
        end
        turtle.digDown = function () 
            print('dig down')
            local success, data = turtle.inspectDown()
            if not success then 
                return false 
            end
            addItemToInventory(data.name)
            local x, y, z = getCoordinatesBeneath()
            addBlock("minecraft:air", x, y, z)
            return true
        end
    end

    -- detect functions
    do
        turtle.detect = function () 
            local success, data = turtle.inspect()
            return success
        end
        turtle.detectUp = function ()
            local success, data = turtle.inspectUp()
            return success
        end
        turtle.detectDown = function ()
            local success, data = turtle.inspectDown()
            return success
        end
    end

    -- inspect functions
    do
        turtle.inspect = function ()
            local x, y, z = getCoordinatesInFront()
            return getBlockAtCoordinates(x, y, z)
        end
        turtle.inspectUp = function ()
            local x, y, z = getCoordinatesAbove()
            return getBlockAtCoordinates(x, y, z)
        end
        turtle.inspectDown = function () 
            local x, y, z = getCoordinatesBeneath()
            return getBlockAtCoordinates(x, y, z)
        end
    end

    -- place functions
    do
        turtle.place = function ()
            if not turtle.detect() or turtle.getItemCount() == 0 then return false end
            local x, y, z = getCoordinatesInFront()
            addBlock(turtle.getItemDetail().name, x, y, z)
            return true
        end
        turtle.placeUp = function ()
            if not turtle.detectUp() or turtle.getItemCount() == 0 then return false end
            local x, y, z = getCoordinatesAbove()
            addBlock(turtle.getItemDetail().name, x, y, z)
            return true
        end
        turtle.placeDown = function ()
            if not turtle.detectDown() or turtle.getItemCount() == 0 then return false end
            local x, y, z = getCoordinatesBeneath()
            addBlock(turtle.getItemDetail().name, x, y, z)
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
                if turtle.getItemCount(i) == 0 then
                    inventory[i].name = name
                    inventory[i].count = 1
                    return
                elseif turtle.getItemCount(i) < 64 and inventory[i].name == name then
                    inventory[i].count = inventory[i].count + 1
                    return
                end
            end
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
