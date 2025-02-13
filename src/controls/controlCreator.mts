import { Controls } from "../stages.mjs";
import { slider } from "../stages.mjs";
import {
  oscillatorWithNumericInputs,
  oscillatorWithConnectInput,
} from "./oscillator.mjs";
import { mixer } from "./mixer.mjs";

export function createControlCreator(parent: HTMLElement, ctrl: Controls) {
  const controlCreationContainer = document.createElement("div");
  controlCreationContainer.id = "control-creation";
  parent.appendChild(controlCreationContainer);

  const controlTypeSelect = document.createElement("select");
  controlTypeSelect.innerHTML = `
    <option value="slider">Slider</option>
    <option value="oscillator">Oscillator</option>
    <option value="connected">Connected Oscillator</option>
    <option value="mixer">Mixer</option>
  `;

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Control name";

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
      case "mixer":
        mixer(ctrl, name);
        break;
    }

    nameInput.value = "";
  });
}
