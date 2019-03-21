chrome.browserAction.onClicked.addListener(function () {
    const url = chrome.runtime.getURL("index.html");
    chrome.tabs.create({ url: url });
});
