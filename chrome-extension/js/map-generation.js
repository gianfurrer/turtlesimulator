const ores = [
    {
        name: "minecraft:diamond_ore",
        minVains: 1, maxVains: 1,
        minPerVain: 3, maxPerVain: 8,
        minLayer: 5, maxLayer: 15, hex: "00ffff"
    },
    {
        name: "minecraft:iron_ore",
        minVains: 1, maxVains: 5,
        minPerVain: 4, maxPerVain: 10,
        minLayer: 5, maxLayer: 45, hex: "b29855"
    },
    {
      name: "minecraft:restone_ore",
      minVains: 2, maxVains: 5,
      minPerVain: 3, maxPerVain: 9,
      minLayer: 5, maxLayer: 50, hex: "ff0000"
    }
]

function initMap(chunks) {
  const map = []
  chunks *= 16;
  for (let x = -chunks; x < chunks; ++x) {
    for (let y = -chunks; y < chunks; ++y) {
      for (let z = 0; z <= 40; ++z) {
        map.push({name:"minecraft:stone", x:x,y:y,z:z});
      }
    }
  }
  return map;
}

function generateMap(chunks=1) {

  const addBlock = (name, coord, coords) => {
    coords.push(coord);
    map = map.filter(m => !(m.x == coord.x && m.y == coord.y && m.z == coord.z));
    map.push({name: name, x: coord.x, y: coord.y, z: coord.z});
  }

  const hasAttachedBlock = (coord, coords) => {
    return coords.filter(c => (c.x == coord.x && c.y == coord.y && Math.abs(c.z - coord.z) == 1)
                || (c.x == coord.x && c.z == coord.z && Math.abs(c.y - coord.y) == 1)
                || (c.z == coord.z && c.y == coord.y && Math.abs(c.x - coord.x) == 1)).length;
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  //let map = initMap(chunks);
  let map = [];
  for (let xC = -chunks; xC < chunks; ++xC) {
    const xChunk = xC * 16;
    for (let yC = -chunks; yC < chunks; ++yC) {
      const yChunk = yC * 16;

      for (let o = 0; o < ores.length; ++o) {
        const ore = ores[o];
        const vains = random(ore.minVains, ore.maxVains);
        for (let v = 0; v < vains; ++v) {
          const usedCoords = [];
          let blocks = random(ore.minPerVain, ore.maxPerVain)-1;
          const vainRange = Math.ceil(ore.maxPerVain / 20);
          const centerBlock = {
            x: random(xChunk + vainRange, xChunk + 15 - vainRange),
            y: random(ore.minLayer + vainRange, ore.maxLayer - vainRange),
            z: random(yChunk + vainRange, yChunk + 15 - vainRange)
          }
          addBlock(ore.name, centerBlock, usedCoords);
          let comparisonCoords = JSON.stringify(usedCoords);
          while (blocks > 0) {
            const coord = {
              x: centerBlock.x + random(-vainRange, vainRange),
              y: centerBlock.y + random(-vainRange, vainRange),
              z: centerBlock.z + random(-vainRange, vainRange)
            }
            if (!comparisonCoords.includes(JSON.stringify(coord)) && hasAttachedBlock(coord, usedCoords)) {
              addBlock(ore.name, coord, usedCoords);
              blocks -= 1;
            }
          }
        }
      }
    }
  }

  return map;
}
