importScripts("sim.js");
self.onmessage = event => {
  try { self.postMessage({id: event.data.id, result: simulate(event.data.config)}); }
  catch (error) { self.postMessage({id: event.data.id, error: String(error)}); }
};
