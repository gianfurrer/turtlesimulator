math.randomseed(os.time())

chunks = 2 -- [CHUNKS_AMOUNT]
map = {}

local function coordExists(coord, coords)
  for m=1, #coords do
    if coords[m].x == coord.x and coords[m].y == coord.y and coords[m].z == coord.z then
      return true
    end
  end
  return false
end

local function addBlock(name, block, vain)
  if not coordExists(block, map) then

    --TEMP CODE
    hex = nil
    if name == "minecraft:diamond_ore" then
      hex = "00ffff"
    elseif name == "minecraft:iron_ore" then
      hex = "b29855"
    end
    print(string.format("würfel(%i|%i|%i, 1){%s}", block.x, block.z, block.y, hex))
    block.name = name
    table.insert(map, block)
    table.insert(vain, block)
  end
end

local function hasAttachedBlock(coord, coords)
  for c=1, #coords do
    if (coords[c].x == coord.x and coords[c].y == coord.y and math.abs(coord.z - coords[c].z) == 1)
        or (coords[c].x == coord.x and coords[c].z == coord.z and math.abs(coord.y - coords[c].y) == 1)
        or (coords[c].y == coord.y and coords[c].z == coord.z and math.abs(coord.x - coords[c].x) == 1) then
      return true
    end
  end
  return false
end

local ores = {
  {
    name = "minecraft:diamond_ore",
    minVains = 1, maxVains = 1,
    minPerVain = 3, maxPerVain = 8,
    minLayer = 5, maxLayer = 20
  },
  {
    name = "minecraft:iron_ore",
    minVains = 3, maxVains = 6,
    minPerVain = 3, maxPerVain = 15,
    minLayer = 5, maxLayer = 40
  }
}


for xChunk = -chunks, chunks-1 do
  xChunk = xChunk * 16
  for zChunk = -chunks, chunks-1 do
    zChunk = zChunk * 16
    for o = 1, #ores do
      local ore = ores[o]
      local vains = math.random(ore.minVains, ore.maxVains)
      for v = 1, vains do
          local vainBlocks = {}
          local blocks = math.random(ore.minPerVain, ore.maxPerVain)-1
          local vainRange = math.ceil(ore.maxPerVain / 20)
          local centerBlock = {
            x = math.random(xChunk + vainRange, xChunk + 15 - vainRange),
            y = math.random(ore.minLayer + vainRange, ore.maxLayer - vainRange),
            z = math.random(zChunk + vainRange, zChunk + 15 - vainRange)
          }
          addBlock(ore.name, centerBlock, vainBlocks)
          while blocks > 0 do
            coord = {
              x = centerBlock.x + math.random(-vainRange, vainRange),
              y = centerBlock.y + math.random(-vainRange, vainRange),
              z = centerBlock.z + math.random(-vainRange, vainRange)
            }
            if not coordExists(coord, vainBlocks) and hasAttachedBlock(coord, vainBlocks) then
              addBlock(ore.name, coord, vainBlocks)
              blocks = blocks - 1
            end
          end
      end
    end
  end
end
