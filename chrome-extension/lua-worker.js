window = {};
self.importScripts("fengari-web.js");
fengari = window.fengari;

window.output = text => {
  self.postMessage(text);
}
self.addEventListener("message", m => {
  fengari.load(m.data)()
})
