import { Controls, slider } from "../stages.mjs";
import { renderControl } from "../utils.mjs";

export function sliderWithNumericInputs(ctrl: Controls, name: string) {
  const { container } = renderControl(name);
  ctrl.register(
    name,
    slider({ id: name, max: 500, value: 50, container, label: "" }),
  );
}
