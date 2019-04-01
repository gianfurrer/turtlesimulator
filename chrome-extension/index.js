let simulatorCode;
this.simulator = {
    addAction: te => {
        console.log(te);
    }
};

getFileContent("simulator.lua", content => {
    simulatorCode = content;
});

function overrideLuaPrint(code) {
    return (
        'local js = require "js"\n\n\n\nfunction print(text)\njs.global:output(text)\nend\n\n' +
        code +
        '\nprint("test [end]")'
    );
}

function getProgram(args) {
    return overrideLuaPrint(
        getArgsCode(args) +
            "\n" +
            simulatorCode +
            "\n" +
            getInventoryCode(startInventory) +
            "\n" +
            document.querySelector("#input").value
    );
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

function getInventoryCode(inventory) {
    let inventoryCode = "inventory = {\n";
    for (let i = 0; i < inventory.length; i++) {
        const slot = inventory[i];
        inventoryCode += `{ name = "${slot.name.value}", count = ${
            slot.count.value
        } },\n`;
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

async function executeProgram() {
    const args = getArgs();
    const program = getProgram(args);
    window.simulator = new Simulator(program);
}

function generateInventory(inventoryElement, slots) {
    inventoryElement.innerHTML = "";
    const inventory = [];
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
    return inventory;
}

function initInventory(inventory, values) {
    for (let i = 0; i < values.length && inventory[i]; ++i) {
        inventory[i].name.value = values[i].name;
        inventory[i].count.value = values[i].count;
    }
}

const directionEnum = { forward: 1, left: 2, back: 3, right: 4 };
const output = document.querySelector("#output");
const errorOutput = document.querySelector("#erorrs");

function Simulator(program) {
    this.inventory = liveInventory
    initInventory(
        this.inventory,
        startInventory.map(
            slot => [{ name: slot.name.value, count: slot.count.value }][0]
        )
    );
    this.blocks = [];
    this.selectedSlot = 1;
    this.fuelLevel = 0;
    this.x = this.y = this.z = 0;
    this.direction = directionEnum.forward;
    this.states = [];


    output.innerHTML = "";

    this.luaWorker = new Worker("lua-worker.js");
    this.luaWorker.onmessage = e => {
        output.textContent += e.data + "\n";
        this.executeAction(e.data);
    };
    this.luaWorker.postMessage(program);

    this.executeAction = action => {
        const components = action.split(" ");
        const func = this.dict[components[1]];
        func(...components.slice(2));
        this.saveState(action)
    };

    const stateElement = document.querySelector("#state");
    stateElement.oninput = e => this.applyState(e.target.value);

    this.saveState = action => {
        this.states.push({
            action: action,
            inventory: this.inventory.map(i => [{name: i.name.value, count: i.count.value}][0]),
            blocks: JSON.parse(JSON.stringify(this.blocks)),
            selectedSlot: this.selectedSlot,
            fuelLevel: this.fuelLevel,
            x: this.x,
            y: this.y,
            z: this.z,
            direction: this.direction
        });
        stateElement.max = this.states.length - 1;
        stateElement.value = this.states.length - 1;
    }

    this.saveState("[Initial]")

    this.applyState = index => {
        const state = this.states[index];
        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i].name.value = state.inventory[i].name;
            this.inventory[i].count.value = state.inventory[i].count;
        }
        this.blocks = state.blocks;
        this.setSelectedSlot(state.selectedSlot);
        this.setFuelLevel(state.fuelLevel);
        this.x = state.x;
        this.y = state.y;
        this.z = state.z;
        this.direction = state.direction;
        stateElement.value = index;
    }

    this.play = () => {
        const timeout = document.querySelector("#timeout").value;
        let i = stateElement.value;
        const intervalId = setInterval(() => {
          if (i < this.states.length) {
            this.applyState(i++);
          }
          else {
            clearInterval(intervalId);
          }
        }, timeout);
    };
    document.querySelector("#play").onclick = this.play;

    const selectedSlotElement = document.querySelector("#selected-slot");
    this.setSelectedSlot = slot => {
        this.selectedSlot = parseInt(slot);
        selectedSlotElement.textContent = this.selectedSlot;
    };

    const fuelLevelElement = document.querySelector("#fuel-level")
    this.setFuelLevel = value => {
        this.fuelLevel = parseInt(value);
        fuelLevelElement.textContent = this.fuelLevel;
    };

    this.move = (x, y, z) => {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    this.turn = direction => {
        this.direction = direction;
    };

    this.addBlock = (name, x, y, z) => {
        this.blocks.push({ name: name, x: x, y: y, z: z });
    };

    this.addItemToInventory = (name, slot) => {
        const inventorySlot = this.inventory[slot - 1];
        if (inventorySlot.name.value == "") {
            inventorySlot.name.value = name;
        }
        inventorySlot.count.value = parseInt(inventorySlot.count.value) + 1;
    };

    this.removeItemFromInventory = quantity => {
        this.inventory[this.selectedSlot - 1].count.value -= quantity;
        if (this.inventory[this.selectedSlot - 1].count.value == 0) {
            this.inventory[this.selectedSlot - 1].name.value = "";
        }
    };

    this.error = text => {
        errorOutput.value += text
    }

    this.end = () => {
        clearInterval(this.intervalId);
        this.luaWorker.terminate();
    };

    this.dict = {
        "[select]": this.setSelectedSlot,
        "[setFuelLevel]": this.setFuelLevel,
        "[move]": this.move,
        "[turn]": this.turn,
        "[addBlock]": this.addBlock,
        "[addItemToInventory]": this.addItemToInventory,
        "[removeItemFromInventory]": this.removeItemFromInventory,
        "[error]": this.error,
        "[end]": this.end,
    };
}

let startInventory;
onload = () => {
    document.querySelector("#btn-execute").onclick = executeProgram;
    const startInventoryElement = document.querySelector("#startInventory");
    const liveInventoryElement = document.querySelector("#liveInventory");
    startInventory = generateInventory(startInventoryElement, 16);
    liveInventory = generateInventory(liveInventoryElement, 16);
    initInventory(startInventory, [
        { name: "minecraft:coal_block", count: 64 }
    ]);
};

onerror = e => {
    if (e.startsWith('[string "..."]') || e.startsWith("uncaught exception")) {
        document.querySelector("#errors").textContent = e.split(":").splice(2).join(":").trim();
    }
};
