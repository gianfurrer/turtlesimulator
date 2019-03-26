
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
    if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    }};
    xhttp.open("POST", "https://rextester.com/rundotnet/Run", true);
    xhttp.send(body);
}

function getProgram(args) {
    let argCode = ""
    if (args) {
        for (let i = 0; i < args.length; i++) {
            argCode += `arg[${i + 1}] = "${args[i]}"\n`
        }
    }

    return argCode + "\n" + simulatorCode + "\n" + getInventoryCode() + "\n" + document.querySelector("#input").value;
}

function getArgs() {
    const args = document.querySelector("#args").value
    return args.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)|(\w+)/g);
}

function getInventoryCode() {
    let inventoryCode = "inventory = {\n";
    const inventorySlots = document.querySelector("#inventory").children;
    for (let i = 0; i < inventorySlots.length; i++) {
        const slot = inventorySlots[i];
        inventoryCode += `{ name = "${slot.children[0].value}", count = ${slot.children[1].value} },\n`;
    }
    inventoryCode += "}";
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
    const args = getArgs()
    const program = getProgram(args)
    runLua(program, (response) => {
        document.querySelector("#output").value = response.Result;
        document.querySelector("#errors").value = response.Errors;
        document.querySelector("#warnings").value = response.Warnings;
    });
}

function generateInventory(slots) {
    const inventory = document.querySelector("#inventory");
    for (let i = 0; i < slots; i++) {
        const inventorySlot = document.createElement("div")
        inventorySlot.setAttribute("id", `inventory-slot-${i}`)

        const slotName = document.createElement("input")
        slotName.setAttribute("type", "text")
        
        const slotCount = document.createElement("input")
        slotCount.setAttribute("type", "number")
        slotCount.setAttribute("min", "0")
        slotCount.setAttribute("max", "64")
        slotCount.value = 0

        inventorySlot.appendChild(slotName)
        inventorySlot.appendChild(slotCount)
        inventory.appendChild(inventorySlot)
    }
}

onload = () => {
    document.querySelector("#btn-execute").onclick = executeProgram;
    generateInventory(16)
}
