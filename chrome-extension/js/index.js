
const itemModal = new ItemModal();

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
        slot.countElement.maxLength = "2"
        slot.countElement.value = "0";

        
        slot.appendChild(slot.imageElement);
        slot.appendChild(slot.nameElement);
        slot.appendChild(slot.countElement);
        slot.imageElement.onclick = () => { itemModal.open(slot) };
        inventoryElement.appendChild(slot);
        inventory.push(slot);
    }
    return inventory;
}

function initInventory(inventory, values) {
    for (let i = 0; i < values.length && inventory[i]; ++i) {
        const name = values[i].name;
        inventory[i].nameElement.value = name;
        inventory[i].countElement.value = values[i].count;
        const item = items.filter(i => i.value === name)[0];
        inventory[i].imageElement.style.background = item ? item.backgroundCss : "";
    }
}

let chunksElement;
let outputElement;
let errorOutputElement;
let simulator3dElement;
let startInventoryElement;
let liveInventoryElement;
let selectedSlotElement;
let fuelLevelElement;
let positionXElement;
let positionYElement;
let positionZElement;
let directionElement;

let stateElement;
let playElement;

let startInventory;
let liveInventory;

onload = () => {
    chunksElement = document.querySelector("#chunks");
    outputElement = document.querySelector("#output");
    errorOutputElement = document.querySelector("#error-output");
    simulator3dElement = document.querySelector("#simulator3d");
    startInventoryElement = document.querySelector("#start-inventory");
    liveInventoryElement = document.querySelector("#live-inventory");
    selectedSlotElement = document.querySelector("#selected-slot");
    fuelLevelElement = document.querySelector("#fuel-level");
    positionXElement = document.querySelector("#position-x");
    positionYElement = document.querySelector("#position-y");
    positionZElement = document.querySelector("#position-z");
    directionElement = document.querySelector("#direction");
    playElement = document.querySelector("#play");
    stateElement = document.querySelector("#state");
    document.querySelector("#btn-execute").onclick = executeProgram;
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
