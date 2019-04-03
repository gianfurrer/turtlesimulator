
this.simulator = {
    addAction: te => {
        console.log(te);
    }
};

let simulatorCode;
getFileContent("ressources/simulator.lua", content => {
    simulatorCode = content;
});

function overrideLuaPrint(code) {
    return (
        'local js = require "js"\n\n\n\nfunction print(text)\njs.global:output(text)\nend\n\n' +
        code
    );
}

function getProgram(args) {
    return overrideLuaPrint(
        getArgsCode(args) +
            "\n" +
            simulatorCode +
            "\n" +
            'printOutput({ "[start]" })' +
            "\n" +
            getInventoryCode(startInventory) +
            "\n" +
            document.querySelector("#input").value +
            "\n" +
            'printOutput({ "[end]" })'
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
        inventoryCode += `{ name = "${slot.nameElement.value}", count = ${
            slot.countElement.value
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
        const slot = document.createElement("div");
        slot.classList.add("inventory-slot");

        slot.imageElement = document.createElement("div");
        slot.imageElement.classList.add("inventory-slot-image");

        slot.nameElement = document.createElement("input");
        slot.nameElement.type = "hidden";
        slot.nameElement.value = "";

        slot.countElement = document.createElement("input");
        slot.countElement.classList.add("inventory-slot-count");
        slot.countElement.type = "text";
        slot.countElement.min = "0";
        slot.countElement.max = "64";
        slot.countElement.value = "0";

        slot.imageElement.appendChild(slot.countElement);
        slot.appendChild(slot.imageElement);
        slot.appendChild(slot.nameElement);
        // slot.appendChild(slot.countElement);
        slot.onclick = openItemModal;
        inventoryElement.appendChild(slot);
        inventory.push(slot);
    }
    return inventory;
}

function initInventory(inventory, values) {
    for (let i = 0; i < values.length && inventory[i]; ++i) {
        inventory[i].nameElement.value = values[i].name;
        inventory[i].countElement.value = values[i].count;
    }
}

function Simulator(program) {
    this.map = generateMap(1);

    const directionEnum = { forward: 1, left: 2, back: 3, right: 4 };
    const output = document.querySelector("#output");
    const errorOutput = document.querySelector("#erorrs");

    this.simulator3d = new Simulator3D(document.querySelector("#simulator3d"));
    this.simulator3d.initCanvas(this.map);
    this.inventory = liveInventory;
    initInventory(
        this.inventory,
        startInventory.map(
            slot => [{ name: slot.nameElement.value, count: slot.countElement.value }][0]
        )
    );
    this.blocks = [];
    this.selectedSlot = 1;
    this.fuelLevel = 0;
    this.x = this.y = this.z = 0;
    this.direction = directionEnum.forward;
    this.states = [];

    output.innerHTML = "";

    this.luaWorker = new Worker("js/lua-worker.js");
    this.luaWorker.onmessage = e => {
        const actionElement = document.createElement("div");
        actionElement.innerText = e.data;
        output.appendChild(actionElement);
        this.executeAction(actionElement);
    };
    this.luaWorker.postMessage(program);

    this.executeAction = actionElement => {
        const components = actionElement.innerText.split(" ");
        const func = this.dict[components[1]];
        func(...components.slice(2));
        this.saveState(actionElement);
    };

    const stateElement = document.querySelector("#state");
    stateElement.oninput = e => this.applyState(e.target.value);

    this.saveState = actionElement => {
        this.states.push({
            actionElement: actionElement,
            inventory: this.inventory.map(
                i => [{ name: i.nameElement.value, count: i.countElement.value }][0]
            ),
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
    };

    this.applyState = index => {
        const state = this.states[index];
        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i].nameElement.value = state.inventory[i].name;
            this.inventory[i].countElement.value = state.inventory[i].count;
        }
        this.blocks = state.blocks;
        this.setSelectedSlot(state.selectedSlot);
        this.setFuelLevel(state.fuelLevel);
        this.x = state.x;
        this.y = state.y;
        this.z = state.z;
        this.direction = state.direction;
        stateElement.value = index;
    };

    this.play = () => {
        const timeout = document.querySelector("#timeout").value;
        let i = stateElement.value;
        const intervalId = setInterval(() => {
            if (i < this.states.length) {
                this.applyState(i++);
            } else {
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

    const fuelLevelElement = document.querySelector("#fuel-level");
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
        const block = { name: name, x: x, y: y, z: z };
        this.simulator3d.addBlock(block);
        this.blocks.push(block);
    };

    this.addItemToInventory = (name, slot) => {
        const inventorySlot = this.inventory[slot - 1];
        if (inventorySlot.nameElement.value == "") {
            inventorySlot.nameElement.value = name;
        }
        inventorySlot.countElement.value = parseInt(inventorySlot.countElement.value) + 1;
    };

    this.removeItemFromInventory = quantity => {
        this.inventory[this.selectedSlot - 1].countElement.value -= quantity;
        if (this.inventory[this.selectedSlot - 1].countElement.value == 0) {
            this.inventory[this.selectedSlot - 1].nameElement.value = "";
        }
    };

    this.error = text => {
        errorOutput.value += text;
    };

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
        "[start]": () => {},
        "[end]": this.end
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
        document.querySelector("#errors").textContent = e
            .split(":")
            .splice(2)
            .join(":")
            .trim();
    }
};
