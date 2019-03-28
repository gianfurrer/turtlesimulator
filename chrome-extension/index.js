
let simulatorCode;
this.simulator = {addAction: te => {console.log(te)}}

getFileContent("simulator.lua", (content) => {
    simulatorCode = content;
})

function overrideLuaPrint(code, id) {
  return 'local js = require "js"\nlocal output = js.global.document:querySelector("#output")\nlocal simulator = js.global.simulator\n\nfunction print(text)\noutput.textContent = string.format("%s%s\\n", output.textContent, text)\nsimulator:addAction(text)\nend\n\n'+code+'\nprint("[end] '+id+'")';
}

function getProgram(args, id) {
    return overrideLuaPrint(getArgsCode(args) + "\n" + simulatorCode + "\n" + getInventoryCode(startInventory) + "\n" + document.querySelector("#input").value, id);
}

function getArgsCode(args) {
    let argsCode = ""
    if (args) {
        for (let i = 0; i < args.length; i++) {
            argsCode += `arg[${i + 1}] = "${args[i]}"\n`
        }
    }

    return argsCode
}

function getArgs() {
    const args = document.querySelector("#args").value
    return args.match(/(?<=(['"]).)(?:(?!\1|\\).|\\.)*(?=\1)|(\w+)/g);
}

function getInventoryCode(inventory) {
    let inventoryCode = "inventory = {\n";
    for (let i = 0; i < inventory.length; i++) {
        const slot = inventory[i];
        inventoryCode += `{ name = "${slot.name.value}", count = ${slot.count.value} },\n`;
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
    const id = new Date().getTime();
    const program = getProgram(args, id);

    window.simulator = new Simulator();

    const script = document.createElement("script")
    script.id = id;
    script.type = "application/lua";
    script.textContent = program;

    document.body.appendChild(script);
}

function generateInventory(inventoryElement, slots) {
    inventoryElement.innerHTML = "";
    const inventory = [];
    for (let i = 0; i < slots; i++) {
        const slot = {}
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
    inventory[i].name.value = values[i].name
    inventory[i].count.value = values[i].count
  }
}

const directionEnum = { forward: 1, left: 2, back: 3, right: 4 };
const output = document.querySelector("#output");
function Simulator() {
  const invElement = document.querySelector("#liveInventory")
  this.inventory = generateInventory(invElement, 16);
  initInventory(this.inventory, startInventory.map(s => [{name: s.name.value, count: s.count.value}][0]));
  this.blocks = [];
  this.selectedSlot = 1;
  this.fuelLevel = 0;
  this.x = this.y = this.z = 0;
  this.direction = directionEnum.forward;
  this.programCounter = 0;
  output.innerHTML = "";
  this.actions = [];

  this.addAction = action => {
    this.actions.push(action);
  }

  this.intervalId = setInterval(() => {
    if (this.actions.length) {
      const action = this.actions.shift();
      const components = action.split(" ");
      const func = this.dict[components[0]];
      func(...components.slice(1));
    }
  }, 100);

  this.setSelectedSlot = (slot) => {
      this.selectedSlot = parseInt(slot)
  }

  this.setFuelLevel = (value) => {
      this.fuelLevel = parseInt(value)
  }

  this.forward = () => {
      if (this.direction == directionEnum.forward) { z += 1 }
      else if (this.direction == directionEnum.back) { z -= 1 }
      else if (this.direction == directionEnum.left) { x -= 1 }
      else if (this.direction == directionEnum.right) { x += 1}
  }

  this.back = () => {
      if (this.direction == directionEnum.forward) { z -= 1 }
      else if (this.direction == directionEnum.back) { z += 1 }
      else if (this.direction == directionEnum.left) { x += 1 }
      else if (this.direction == directionEnum.right) { x -= 1}
  }

  this.up = () => {
      this.y += 1
  }

  this.down = () => {
      this.y -= 1
  }

  this.turnLeft = () => {
      if (this.direction == directionEnum.right) { this.direction = direction.forward }
      else (this.direction += 1)
  }

  this.turnRight = () => {
      if (this.direction == directionEnum.forward) { this.direction = direction.right }
      else (this.direction -= 1)
  }

  this.addBlock = (name, x, y, z) => {
      this.blocks.push({ name: name, x: x, y: y, z: z })
  }

  this.addItemToInventory = (name, slot) => {
      const inventorySlot = this.inventory[slot - 1];
      if (inventorySlot.name.value == "")
      {
          inventorySlot.name.value = name;
      }
      inventorySlot.count.value = 0;
  }

  this.removeItemFromInventory = (quantity) => {
      this.inventory[this.selectedSlot - 1].count.value -= quantity
  }

  this.end = id => {
    clearInterval(this.intervalId);
    Array.from(document.querySelectorAll("script")).filter(s => s.id == id)[0].remove();
  }

  this.dict = {
      "[setSelectedSlot]": this.setSelectedSlot, "[setFuelLevel]": this.setFuelLevel,
      "[forward]": this.forward, "[up]": this.up, "[down]": this.down, "[back]": this.back,
      "[turnLeft]": this.turnLeft, "[turnRight]": this.turnRight,
      "[addBlock]": this.addBlock, "[addItemToInventory]": this.addItemToInventory, "[removeItemFromInventory]": this.removeItemFromInventory,
      "[end]": this.end
  };
}

let startInventory;
onload = () => {
    document.querySelector("#btn-execute").onclick = executeProgram;
    const startInventoryElement = document.querySelector("#startInventory");
    startInventory = generateInventory(startInventoryElement, 16);
    initInventory(startInventory, [{name: "minecraft:coal_block", count: 64}]);
}

onerror = e => {
  if (e.startsWith('[string "..."]')) {
    document.querySelector("#errors").textContent = e.split(":").splice(2).join(":").trim();
  }
}
