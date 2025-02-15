import { Controls, slider } from "../stages.mjs";
import { renderControl } from "../utils.mjs";

export function sliderWithNumericInputs(ctrl: Controls, name: string) {
  const { container, showValue } = renderControl(name);

  const s = slider({ id: name, max: 500, value: 50, container, label: "" });

  ctrl.register(name, {
    get(now) {
      const val = s.get(now);
      showValue(val);
      return val;
    },
    subscribe() {},
    cycle() {},
  });
}
