window = {};
self.importScripts("fengari-web.js");
fengari = window.fengari;

window.output = text => {
  self.postMessage(text);
}
self.onmessage = m => {
  fengari.load(m.data)()
}
