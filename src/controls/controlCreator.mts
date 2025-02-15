import { Controls } from "../stages.mjs";
import { oscillatorWithConnectInput } from "./oscillator.mjs";
import { mixer } from "./mixer.mjs";
import { sliderWithNumericInputs } from "./slider.mjs";

export function createControlCreator(parent: HTMLElement, ctrl: Controls) {
  const controlCreationContainer = document.createElement("div");
  controlCreationContainer.id = "control-creation";
  parent.appendChild(controlCreationContainer);

  const controlTypeSelect = document.createElement("select");
  controlTypeSelect.innerHTML = `
    <option value="slider">Slider</option>
    <option value="oscillator">Oscillator</option>
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
        sliderWithNumericInputs(ctrl, name);
        break;
      case "oscillator":
        oscillatorWithConnectInput(ctrl, name);
        break;
      case "mixer":
        mixer(ctrl, name);
        break;
    }

    nameInput.value = "";
  });
}
