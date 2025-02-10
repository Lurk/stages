import { createBuffer } from "./buffer.mjs";
import { initFullScreenCanvas, path } from "./canvas.mjs";
import {
  controls,
  slider,
} from "./stages.mjs";
import { 
  oscillatorWithNumericInputs, 
  oscillatorWithConnectInput,
} from "./controls/oscillator.mjs";
import { sumWithConnectInputs } from "./controls/sum.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();

// Add after other control registrations but before the animation code
const outputSelector = document.createElement("select");
outputSelector.id = "output-selector";
document.body.appendChild(outputSelector);

// Add all registered controls as options
ctrl.keys().forEach(id => {
  const option = document.createElement("option");
  option.value = id;
  option.text = id;
  if (id === "main") option.selected = true; // Default to "main"
  outputSelector.appendChild(option);
});

// Add after other control registrations but before the animation code
const controlCreationContainer = document.createElement("div");
controlCreationContainer.id = "control-creation";
document.body.appendChild(controlCreationContainer);

// Add control type selector
const controlTypeSelect = document.createElement("select");
controlTypeSelect.innerHTML = `
  <option value="slider">Slider</option>
  <option value="oscillator">Oscillator</option>
  <option value="connected">Connected Oscillator</option>
  <option value="sum">Sum</option>
`;

// Add name input
const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Control name";

// Add create button
const createButton = document.createElement("button");
createButton.textContent = "Create Control";

controlCreationContainer.appendChild(nameInput);
controlCreationContainer.appendChild(controlTypeSelect);
controlCreationContainer.appendChild(createButton);

createButton.addEventListener("click", () => {
  const type = controlTypeSelect.value;
  const name = nameInput.value.trim();
  
  if (!name) {
    alert("Please enter a name");
    return;
  }

  switch (type) {
    case "slider":
      ctrl.register(name, slider({ id: name, max: 500, value: 50 }));
      break;
    case "oscillator":
      oscillatorWithNumericInputs(ctrl, name);
      break;
    case "connected":
      oscillatorWithConnectInput(ctrl, name);
      break;
    case "sum":
      sumWithConnectInputs(ctrl, name);
      break;
  }

  // Update output selector
  const option = document.createElement("option");
  option.value = name;
  option.text = name;
  outputSelector.appendChild(option);

  nameInput.value = ""; // Clear input
});

const buffer = createBuffer(Math.round(ctx.canvas.width));

function a() {
  requestAnimationFrame((now) => {
    buffer.resize(ctx.canvas.width);
    const vHalf = ctx.canvas.height / 2;
    const selectedControl = outputSelector.value;
    buffer.push(ctrl.get(selectedControl)?.get(now) ?? 0);
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 1,
      y: (y) => vHalf - 500 / 2 + y,
    });
    a();
  });
}

a();
