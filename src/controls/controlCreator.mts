import { oscillatorWithConnectInput } from "./oscillator.mjs";
import { mixer } from "./mixer.mjs";
import { sliderWithNumericInputs } from "./slider.mjs";
import { Controls } from "../controls.mjs";
import { renderControl, renderSelectInputTo } from "../utils.mjs";

export function createControlCreator(ctrl: Controls) {
  const { container } = renderControl("control");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Control name";
  container.appendChild(nameInput);

  const { el: controlTypeSelect } = renderSelectInputTo({
    container,
    options: ["slider", "oscillator", "mixer"],
    id: "control-creation-select",
    label: "type:",
  });

  const createButton = document.createElement("button");
  createButton.textContent = "Create Control";

  container.appendChild(createButton);

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
