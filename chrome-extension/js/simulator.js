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
        this.saveStateAt = 50;
        this.states = [];
        this.actions = [];
        this.timeoutElement = document.querySelector("#timeout");
        this.stateSlider = document.querySelector("#state");
        
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
        if (!this.funcNameToFuncDict[components[1]]) {
            return;
        }
        const func = this.funcNameToFuncDict[components[1]].func;
        const args = components.slice(2);
        func(...args);
        this.actions.push({func: func, args: args});
        stateElement.value = ++stateElement.max;
        if (!(this.actions % this.saveStateAt)) {
            this.saveState();
        }
    };

    saveState = () => {
        this.states.push({
            inventory: this.inventory.map(
                i => [{ name: i.nameElement.value, count: i.countElement.value, backgroundCss: i.imageElement.style.background }][0]
            ),
            blocks: JSON.parse(JSON.stringify(this.blocks)),
            selectedSlot: this.selectedSlot,
            fuelLevel: this.fuelLevel,
            x: this.positionX,
            y: this.positionY,
            z: this.positionZ,
            direction: this.direction,
            map: JSON.parse(JSON.stringify(this.simulator3d.map)) 
        });
    };

    applyState = index => {
        let stateIndex = Math.floor(index / this.saveStateAt)*this.saveStateAt
        const state = this.states[stateIndex];
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
        this.simulator3d.initCanvas(state.map); 
        for (let i = stateIndex; i < index; ++i) {
            const action = this.actions[i];
            action.func(...action.args);
        }
    };

    play = () => {
        const timeout = this.timeoutElement.value;
        let i = stateElement.value;
        this.applyState(i);
        const intervalId = setInterval(() => {
            if (i < this.actions.length) {
                do {
                    const action = this.actions[i++];
                    action.func(...action.args);
                } while(!this.funcNameToFuncDict["["+this.actions[i].func.name+"]"].timeout && i < this.actions.length);
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
        if (inventorySlot) {
            if (inventorySlot.nameElement.value == "") {
                inventorySlot.nameElement.value = name;
                inventorySlot.imageElement.style.background = items.find(i => i.value == name).backgroundCss;
                inventorySlot.countElement.value = 0;
            }
    
            if (inventorySlot.nameElement.value == name) {
                const maxStack = items.filter(i => i.value == name)[0].stackSize;
                if (inventorySlot.countElement.value < maxStack) {
                    inventorySlot.countElement.value = parseInt(inventorySlot.countElement.value) + 1;
                } 
                else {
                    console.error("[LUA ERROR] Max stack size exceeded");
                }
            }
            else {
                console.error("[LUA ERROR] Slot ${slot} already contains ${inventorySlot.nameElement.value} (Tried to add {name})");
            }
        } 
    };

    removeItemFromInventory = quantity => {
        const slot = this.inventory[this.selectedSlot - 1]
        if (slot.countElement.value) {
            slot.countElement.value -= quantity;
            if (slot.countElement.value <= 0) {
                slot.countElement.value = 0;
                slot.nameElement.value = "";
                slot.imageElement.style.background = "";
            }
        }
    };

    error = text => {
        errorOutputElement.value += text;
    };

    start = () => {
        this.stateSlider.max = this.stateSlider.value = 0;
        this.simulator3d.freeze(true);
    }

    end = () => {
        clearInterval(this.intervalId);
        this.luaWorker.terminate();
        this.simulator3d.freeze(false);
    };

    funcNameToFuncDict = {
        "[select]": {func: this.setSelectedSlot, timeout: false},
        "[setFuelLevel]": {func: this.setFuelLevel, timeout: false},
        "[move]": {func: this.move, timeout: true},
        "[turn]": {func: this.turn, timeout: true},
        "[addBlock]": {func: this.addBlock, timeout: true},
        "[addItemToInventory]": {func: this.addItemToInventory, timeout: false},
        "[removeItemFromInventory]": {func: this.removeItemFromInventory, timeout: false},
        "[drop]": {func: this.removeItemFromInventory, timeout: false},
        "[error]": {func: this.error, timeout: false},
        "[start]": {func: this.start, timeout: false},
        "[end]": {func: this.end, timeout: false},
        "[log]": {func: console.log, timeout: false}
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
