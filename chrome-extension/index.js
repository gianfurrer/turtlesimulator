const runLua = (code, callback) => {
	body = "input="+code
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            const httpResponse = document.createElement("html")
            httpResponse.innerHTML = this.responseText
            callback(httpResponse.querySelector("body > textarea").textContent)
        }
    }
    };
    xhttp.open("POST", "https://www.lua.org/cgi-bin/demo", true);
    xhttp.send(body);
}


// Removable Example Usages
runLua("print('inline lamda call')", result => {
	console.log(result)
})

function myFunc(result) {
  console.log(result);
}
runLua("print('myFunc Call')", myFunc)
