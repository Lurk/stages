import { Controls, slider } from "../stages.mjs";
import { getOrCreateControl } from "../utils.mjs";

export function sliderWithNumericInputs(ctrl: Controls, name: string) {
  const container = getOrCreateControl(name);
  const controls = document.createElement("div");
  controls.classList.add("controls");
  container.appendChild(controls);

  ctrl.register(
    name,
    slider({ id: name, max: 500, value: 50, container: controls, label: "" }),
  );
}
