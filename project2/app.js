const definitions = [
  {key:"load", label:"Replica load", min:0.2, max:3, step:0.1, value:1.5, unit:"transmissions / slot"},
  {key:"replicas", label:"Replicas", min:2, max:4, step:1, value:2, unit:"copies / packet"},
  {key:"snr", label:"SNR", min:-8, max:5, step:0.1, value:-2.2, unit:"dB"},
  {key:"threshold", label:"Decode threshold", min:0.1, max:2, step:0.01, value:0.61, unit:"linear SINR"},
  {key:"seed", label:"Random seed", min:0, max:999, step:1, value:7, unit:"frame variation"}
];
const grid = document.querySelector("#grid"), sliders = document.querySelector("#sliders");
const cells = Array.from({length:100}, (_, index) => {
  const cell = document.createElement("div");
  cell.className = "slot"; cell.dataset.slot = index; cell.title = `Slot ${index}`;
  grid.append(cell); return cell;
});
const inputs = {};
for (const definition of definitions) {
  const control = document.createElement("div"); control.className = "control";
  const label = document.createElement("label"); label.htmlFor = definition.key;
  const title = document.createElement("span"); title.textContent = definition.label;
  const output = document.createElement("output"); output.textContent = definition.value;
  label.append(title, output);
  const input = document.createElement("input"); input.type = "range"; input.id = definition.key;
  Object.assign(input, {min:definition.min, max:definition.max, step:definition.step, value:definition.value});
  const unit = document.createElement("small"); unit.textContent = definition.unit;
  input.addEventListener("input", () => { output.textContent = input.value; schedule(); });
  control.append(label, input, unit); sliders.append(control); inputs[definition.key] = input;
}
const state = document.querySelector("#frame-state"), label = document.querySelector("#event-label");
const eventCount = document.querySelector("#event-count"), progress = document.querySelector("#progress");
const scorebars = document.querySelector("#scorebars");
let worker, requestId = 0, debounce, animation, current;
function config() { return Object.fromEntries(definitions.map(definition => [definition.key, Number(inputs[definition.key].value)])); }
function schedule() {
  clearTimeout(debounce); clearInterval(animation);
  state.textContent = "UPDATING"; label.textContent = "Recomputing frame…";
  debounce = setTimeout(run, 190);
}
function run() {
  if (worker) worker.terminate();
  const id = ++requestId;
  worker = new Worker("worker.js");
  worker.onmessage = event => {
    if (event.data.id !== requestId) return;
    if (event.data.error) { state.textContent = "ERROR"; label.textContent = event.data.error; return; }
    current = event.data.result; render(current); play();
    worker.terminate(); worker = null;
  };
  worker.onerror = () => { state.textContent = "ERROR"; label.textContent = "Simulation failed. Try another frame."; };
  worker.postMessage({id, config:config()});
}
function render(result) {
  result.occupancy.forEach((count, index) => { cells[index].className = `slot ${count === 0 ? "empty" : count === 1 ? "single" : "collision"}`; });
  document.querySelector("#users").textContent = result.users;
  document.querySelector("#extra").textContent = result.extra;
  document.querySelector("#correlations").textContent = result.correlations.toLocaleString();
  scorebars.replaceChildren();
  ["ALOHA","CRDSA","MARSALA"].forEach((name, index) => {
    const row = document.createElement("div"); row.className = "score-row";
    const text = document.createElement("span"); text.textContent = name;
    const rail = document.createElement("div"); rail.className = "rail";
    const bar = document.createElement("div"); bar.className = "bar"; bar.style.background = ["#90a7bf","#48d5e6","#ffd166"][index];
    rail.append(bar);
    const number = document.createElement("b"); number.textContent = result.counts[index];
    row.append(text, rail, number); scorebars.append(row);
    requestAnimationFrame(() => { bar.style.width = `${100 * result.counts[index] / result.users}%`; });
  });
  label.textContent = `FRAME READY · ${result.load.toFixed(2)} replica load`;
  eventCount.textContent = `0 / ${result.trace.length}`; progress.style.width = "0%";
  state.textContent = "DECODING";
}
function play() {
  if (!current) return;
  clearInterval(animation); render(current);
  let index = 0;
  animation = setInterval(() => {
    for (let batch = 0; batch < 2 && index < current.trace.length; batch++, index++) {
      const event = current.trace[index], kind = event.stage === "marsala" ? "marsala" : "sic";
      for (const slot of event.slots) {
        const cell = cells[slot];
        cell.classList.remove("single", "collision", "empty", "flash");
        if (kind === "marsala" || !cell.classList.contains("marsala")) cell.classList.add(kind);
        void cell.offsetWidth; cell.classList.add("flash");
      }
      label.textContent = `${kind === "marsala" ? "MARSALA COMBINE" : "SIC CANCEL"} · packet ${event.packet}`;
    }
    eventCount.textContent = `${index} / ${current.trace.length}`;
    progress.style.width = `${100 * index / Math.max(1, current.trace.length)}%`;
    if (index >= current.trace.length) { clearInterval(animation); state.textContent = "COMPLETE"; label.textContent = `FRAME COMPLETE · ${current.counts[2]} packets delivered`; }
  }, 85);
}
document.querySelector("#new-frame").addEventListener("click", () => {
  inputs.seed.value = (Number(inputs.seed.value) + 1) % 1000;
  inputs.seed.dispatchEvent(new Event("input"));
});
document.querySelector("#replay").addEventListener("click", play);
run();
