const directionEnum = { forward: 1, left: 2, back: 3, right: 4 };

class Simulator {
    constructor(program, blocks) {
        this.blocks = blocks;
        this.simulator3d = new Simulator3D(simulator3dElement);
        this.simulator3d.initCanvas(this.blocks);
        this.inventory = liveInventory;
        outputElement.innerHTML = "";
        initInventory(
            this.inventory,
            startInventory.map(
                slot =>
                    [
                        {
                            name: slot.nameElement.value,
                            count: slot.countElement.value
                        }
                    ][0]
            )
        );
        
        this.selectedSlot = 1;
        this.fuelLevel = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.direction = directionEnum.forward;
        this.states = [];
        
        stateElement.oninput = e => this.applyState(e.target.value);
        playElement.onclick = this.play

        this.luaWorker = new Worker("js/lua-worker.js");
        this.luaWorker.onmessage = e => {
            const actionElement = document.createElement("div");
            actionElement.innerText = e.data;
            output.appendChild(actionElement);
            this.executeAction(actionElement);
        };
        this.luaWorker.postMessage(program);
    }

    executeAction = actionElement => {
        const components = actionElement.innerText.split(" ");
        const func = this.funcNameToFuncDict[components[1]];
        func(...components.slice(2));
        this.saveState(actionElement);
    };

    saveState = actionElement => {
        this.states.push({
            actionElement: actionElement,
            inventory: this.inventory.map(
                i => [{ name: i.nameElement.value, count: i.countElement.value, backgroundCss: i.imageElement.style.background }][0]
            ),
            blocks: JSON.parse(JSON.stringify(this.blocks)),
            selectedSlot: this.selectedSlot,
            fuelLevel: this.fuelLevel,
            x: this.positionX,
            y: this.positionY,
            z: this.positionZ,
            direction: this.direction
        });
        stateElement.max = this.states.length - 1;
        stateElement.value = this.states.length - 1;
    };

    applyState = index => {
        const state = this.states[index];
        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i].nameElement.value = state.inventory[i].name;
            this.inventory[i].imageElement.style.background = state.inventory[i].backgroundCss;
            this.inventory[i].countElement.value = state.inventory[i].count;
        }
        this.blocks = state.blocks;
        this.setSelectedSlot(state.selectedSlot);
        this.setFuelLevel(state.fuelLevel);
        this.move(state.x, state.y, state.z);
        this.turn(state.direction);
        stateElement.value = index;
    };

    play = () => {
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

    setSelectedSlot = slot => {
        this.selectedSlot = slot;
    };

    setFuelLevel = value => {
        this.fuelLevel = value;
    };

    move = (x, y, z) => {
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
    };

    turn = direction => {
        this.direction = direction;
    };

    addBlock = (name, x, y, z) => {
        const block = { name: name, x: x, y: y, z: z };
        this.simulator3d.addBlock(block);
        this.blocks.push(block);
    };

    addItemToInventory = (name, slot) => {
        const inventorySlot = this.inventory[slot - 1];
        if (inventorySlot.nameElement.value == "") {
            inventorySlot.nameElement.value = name;
            inventorySlot.imageElement.style.background = items.find(i => i.value == name).backgroundCss;
        }
        inventorySlot.countElement.value = parseInt(inventorySlot.countElement.value) + 1;
    };

    removeItemFromInventory = quantity => {
        const slot = this.inventory[this.selectedSlot - 1];
        slot.countElement.value -= quantity;
        if (slot.countElement.value == 0) {
            slot.nameElement.value = "";
            slot.imageElement.style.background = "";
        }
    };

    error = text => {
        errorOutputElement.value += text;
    };

    end = () => {
        clearInterval(this.intervalId);
        this.luaWorker.terminate();
    };

    funcNameToFuncDict = {
        "[select]": this.setSelectedSlot,
        "[setFuelLevel]": this.setFuelLevel,
        "[move]": this.move,
        "[turn]": this.turn,
        "[addBlock]": this.addBlock,
        "[addItemToInventory]": this.addItemToInventory,
        "[removeItemFromInventory]": this.removeItemFromInventory,
        "[drop]": this.removeItemFromInventory,
        "[error]": this.error,
        "[start]": () => {},
        "[end]": this.end
    };


    set selectedSlot(value) {
        selectedSlotElement.textContent = value;
    }
    get selectedSlot() {
        return parseInt(selectedSlotElement.textContent);
    }

    set fuelLevel(value) {
        fuelLevelElement.textContent = value;
    }
    get fuelLevel() {
        return parseInt(fuelLevelElement.textContent);
    }

    set positionX(value) {
        positionXElement.textContent = value;
    }
    get positionX() {
        return parseInt(positionXElement.textContent);
    }

    set positionY(value) {
        positionYElement.textContent = value;
    }
    get positionY() {
        return parseInt(positionYElement.textContent);
    }

    set positionZ(value) {
        positionZElement.textContent = value;
    }
    get positionZ() {
        return parseInt(positionZElement.textContent);
    }

    set direction(value) {
        directionElement.textContent = value;
    }
    get direction() {
        return parseInt(directionElement.textContent);
    }
}
