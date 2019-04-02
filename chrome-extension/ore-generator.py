import math
import random
import urllib.parse
import webbrowser
import pyperclip
import time

start = time.time()
chunks = 10


x = "x"
y = "y"
z = "z"
name = "name"
minVains = "minVains"
maxVains = "maxVains"
minPerVain = "minPerVain"
maxPerVain = "maxPerVain"
minLayer = "minLayer"
maxLayer = "maxLayer"
hex = "hex"

ores = [
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
    }
]


def addBlock(name, coord, coords):
    hexCode = next(filter(lambda o: o["name"] == name, ores))["hex"]
    #string = "würfel({}|{}|{}, 1){{{}}}".format(coord[x], coord[z], coord[y], hexCode)
    string = "{} {} {} {}".format(name, coord[x], coord[y], coord[z])
    global genString
    genString += "{}\n".format(string)
    # print(string)
    coords.append(coord)


def hasAttachedBlock(coord, coords):
    return len(list(filter(lambda c: (c[x] == coord[x] and c[y] == coord[y] and abs(coord[z] - c[z]) == 1)
                           or (c[x] == coord[x] and c[z] == coord[z] and abs(coord[y] - c[y]) == 1)
                           or (c[y] == coord[y] and c[z] == coord[z] and abs(coord[x] - c[x]) == 1), coords))) > 0


genString = ""
for xChunk in range(-chunks, chunks-1):
    xChunk *= 16
    for yChunk in range(-chunks, chunks-1):
        yChunk *= 16
        for ore in ores:
            vains = random.randint(ore[minVains], ore[maxVains])
            for vain in range(vains):
                usedCoords = []
                blocks = random.randint(ore[minPerVain], ore[maxPerVain])-1
                vainRange = math.ceil(ore[maxPerVain] / 20)
                centerBlock = {
                    x: random.randint(xChunk + vainRange, xChunk + 15 - vainRange),
                    y: random.randint(ore[minLayer]+vainRange, ore[maxLayer]-vainRange),
                    z: random.randint(yChunk + vainRange, yChunk + 15 - vainRange)
                }
                addBlock(ore[name], centerBlock, usedCoords)
                while blocks > 0:
                    coord = {
                        x: centerBlock[x] + random.randint(-vainRange, vainRange),
                        y: centerBlock[y] + random.randint(-vainRange, vainRange),
                        z: centerBlock[z] + random.randint(-vainRange, vainRange)
                    }
                    if coord not in usedCoords and hasAttachedBlock(coord, usedCoords):
                        addBlock(ore[name], coord, usedCoords)
                        blocks -= 1

end = time.time()

#url = "./3DGen.html?draw={}".format(genString)
# webbrowser.open(url)

print(end - start)
pyperclip.copy(genString)
