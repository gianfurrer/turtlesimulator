
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
            callback(JSON.parse(this.responseText).Result);
        }
    }};
    xhttp.open("POST", "https://rextester.com/rundotnet/Run", true);
    xhttp.send(body);
}

function getProgram() {
    return simulatorCode + "\n" + document.querySelector("#input").value;
}

function getArgs() {
    const args = document.querySelector("#args").value
    return args.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)|(\w+)/g);
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
    const program = getProgram()
    runLua(program, (result) => {
        document.querySelector("#output").value = result;
    });
}

onload = () => {
    document.querySelector("#btn-execute").onclick = executeProgram;
}
