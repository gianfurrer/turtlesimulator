const runLua = (code, callback) => {
    const body = new FormData();
    body.append("lang", "lua");
    body.append("device", "");
    body.append("code", code);
    body.append("stdinput", "");
    body.append("ext", "lua");
    body.append("compile", "0");
    body.append("execute", "lua main.lua");
    body.append("mainfile", "main.lua");
    body.append("uid", "ZumGlückIgnorieretsDeScheiss");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            const httpResponse = document.createElement("html")
            httpResponse.innerHTML = this.responseText
            httpResponse.querySelector("span").remove();
            callback(httpResponse.textContent);
        }
    }
    };
    xhttp.open("POST", "https://tpcg.tutorialspoint.com/tpcg.php", true);
    xhttp.send(body);
}

// Removable Example Usages
runLua("print('inline lamda call')", result => {
  console.log(result)
});

function mergeCode(callback) {
    getFileContent("simulator.lua", (simulatorCode) => {
        userCode = document.querySelector("#input").textContent;
        callback(simulatorCode + userCode);
    });
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

function execute() {
    mergeCode((code) => {
        runLua(code, (result) => {
            document.querySelector("output").textContent = result;
        });
    });
}

onload = () => {
    document.querySelector("#btn-execute").onclick = execute;
}