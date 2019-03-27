
let simulatorCode;

getFileContent("simulator.lua", (content) => {
    simulatorCode = content;
})

function runLua (program, callback) {
    const body = new FormData();
    body.append("LanguageChoiceWrapper", "14");
    body.append("Program", program);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(JSON.parse(this.responseText));
    }};
    xhttp.open("POST", "https://rextester.com/rundotnet/Run", true);
    xhttp.send(body);
}

function getProgram(args) {
    return getArgsCode(args) + "\n" + simulatorCode + "\n" + getInventoryCode() + "\n" + document.querySelector("#input").value;
}

function getArgsCode(args) {
    let argsCode = "";
    if (args) {
        for (let i = 0; i < args.length; i++) {
            argsCode += `arg[${i + 1}] = "${args[i]}"\n`;
        }
    }
    return argsCode;
}

function getArgs() {
    const args = document.querySelector("#args").value;
    return args.match(/(?<=(['"]).)(?:(?!\1|\\).|\\.)*(?=\1)|(\w+)/g);
}

function getInventoryCode() {
    let inventoryCode = "inventory = {\n";
    const inventorySlots = document.querySelector("#inventory").children;
    for (let i = 0; i < inventorySlots.length; i++) {
        const slot = inventorySlots[i];
        inventoryCode += `{ name = "${slot.children[0].value}", count = ${slot.children[1].value} },\n`;
    }
    inventoryCode += "}\n";
    return inventoryCode;
}

function getFileContent(fileName, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhttp.open("GET", chrome.runtime.getURL(fileName), true);
    xhttp.send();
}

function executeProgram() {
    const args = getArgs();
    const program = getProgram(args);
    runLua(program, (response) => {
        document.querySelector("#output").value = response.Result;
        document.querySelector("#errors").value = response.Errors;
        document.querySelector("#warnings").value = response.Warnings;
        simulate(response.Result);
    });
}

function generateInventory(slots) {
    const inventoryElement = document.querySelector("#inventory");
    for (let i = 0; i < slots; i++) {
        const slot = {};
        const inventorySlot = document.createElement("div");
        inventorySlot.id = `inventory-slot-${i + 1}`;

        slot.name = document.createElement("input");
        slot.name.type = "text";
        slot.name.value = "";

        slot.count = document.createElement("input");
        slot.count.type = "number";
        slot.count.min = "0";
        slot.count.max = "64";
        slot.count.value = 0;

        inventorySlot.appendChild(slot.name);
        inventorySlot.appendChild(slot.count);
        inventoryElement.appendChild(inventorySlot);
        inventory.push(slot);
    }
}

const dict = {
    "[setSelectedSlot]": setSelectedSlot, "[setFuelLevel]": setFuelLevel,
    "[forward]": forward, "[up]": up, "[down]": down, "[back]": back,
    "[turnLeft]": turnLeft, "[turnRight]": turnRight,
    "[addBlock]": addBlock, "[addItemToInventory]": addItemToInventory, "[removeItemFromInventory]": removeItemFromInventory
};

function simulate(output) {
    const lines = output.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
        const components = lines[i].split(" ")
        const func = dict[components[0]];
        func(...components.slice(1));
    }
}

const directionEnum = { forward: 1, left: 2, back: 3, right: 4 };
const inventory = [];
const blocks = [];
let selectedSlot = 1;
let fuelLevel = 0;
let x = 0;
let y = 0;
let z = 0;
let direction = directionEnum.forward;

function setSelectedSlot(slot) {
    selectedSlot = parseInt(slot);
    document.querySelector("#selected-slot").textContent = selectedSlot;
}

function setFuelLevel(value) {
    fuelLevel = parseInt(value);
    document.querySelector("#fuel-level").textContent = fuelLevel;
}

function forward() {
    if (direction == directionEnum.forward) { z += 1; }
    else if (direction == directionEnum.back) { z -= 1; }
    else if (direction == directionEnum.left) { x -= 1; }
    else if (direction == directionEnum.right) { x += 1; }
}

function back() {
    if (direction == directionEnum.forward) { z -= 1; }
    else if (direction == directionEnum.back) { z += 1;}
    else if (direction == directionEnum.left) { x += 1; }
    else if (direction == directionEnum.right) { x -= 1; }
}

function up() {
    y += 1;
}

function down() {
    y -= 1;
}

function turnLeft() {
    if (direction == directionEnum.right) { direction = direction.forward; }
    else { direction += 1; }
}

function turnRight() {
    if (direction == directionEnum.forward) { direction = direction.right }
    else { direction -= 1; }
}

function addBlock(name, x, y, z) {
    blocks.push({ name: name, x: x, y: y, z: z });
}

function addItemToInventory(name, slot) {
    const inventorySlot = inventory[slot - 1];
    if (inventorySlot.name.value == "")
    {
        inventorySlot.name.value = name;
    }
    inventorySlot.count.value = parseInt(inventorySlot.count.value) + 1;
}

function removeItemFromInventory(quantity) {
    inventory[selectedSlot - 1].count.value = parseInt(inventory[selectedSlot - 1].count.value) - parseInt(quantity);
    if (inventory[selectedSlot - 1].count.value == 0) {
        inventory[selectedSlot - 1].name.value = "";
    }
}

function initInventory(inv) {
  for (let i = 0; i < inv.length && inventory[i]; ++i) {
    inventory[i].name.value = inv[i].name;
    inventory[i].count.value = inv[i].count;
  }
}


onload = () => {
    document.querySelector("#btn-execute").onclick = executeProgram;
    generateInventory(16);
    initInventory([{name: "minecraft:coal_block", count: 64}]);
}
