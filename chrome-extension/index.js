const runLua = (code, callback) => {
    const body = new FormData();
    body.append("LanguageChoiceWrapper", "14");
    body.append("EditorChoiceWrapper", "1");
    body.append("LayoutChoiceWrapper", "1");
    body.append("Program", code);
    body.append("Input", "");
    body.append("Privacy", "");
    body.append("PrivacyUsers", "");
    body.append("Title", "");
    body.append("SavedOutput", "");
    body.append("WholeError", "");
    body.append("WholeWarning", "");
    body.append("StatsToSave", "");
    body.append("CodeGuid", "");
    body.append("IsInEditMode", "False");
    body.append("IsLive", "False");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
            //const httpResponse = document.createElement("html")
            //httpResponse.innerHTML = this.responseText
            //httpResponse.querySelector("span").remove();
            callback(JSON.parse(this.responseText).Result);
        }
    }
    };
    xhttp.open("POST", "https://rextester.com/rundotnet/Run", true);
    xhttp.send(body);
}

function mergeCode(callback) {
    getFileContent("simulator.lua", (simulatorCode) => {
        userCode = document.querySelector("#input").value;
        callback(simulatorCode + "\n" + userCode);
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
            document.querySelector("#output").value = result;
        });
    });
}

onload = () => {
    document.querySelector("#btn-execute").onclick = execute;
}
