import { Controls, slider } from "../stages.mjs";

export function sliderWithNumericInputs(ctrl: Controls, name: string) {
  ctrl.register(name, slider({ id: name, max: 500, value: 50 }));
}

