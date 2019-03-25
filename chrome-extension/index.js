function runLua(code, callback) {
	body = "input=" + code;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 200) {
                const httpResponse = document.createElement("html");
                httpResponse.innerHTML = this.responseText;
                callback(httpResponse.querySelector("body > textarea").textContent);
            }
        }
    };
    xhttp.open("POST", "https://www.lua.org/cgi-bin/demo", true);
    xhttp.send(body);
}

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