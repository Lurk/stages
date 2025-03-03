import { Controls } from "../controls.mjs";
import {
  renderControl,
  renderNumberInputTo,
  renderRangeTo,
} from "../utils.mjs";

export function sliderWithNumericInputs(ctrl: Controls, name: string) {
  ctrl.register(name, () => {
    const { container, showValue } = renderControl(name, () =>
      ctrl.unregister(name),
    );

    const to = renderNumberInputTo({
      id: `${name}_to`,
      label: "to",
      container,
      value: 500,
    });

    const s = renderRangeTo({
      id: name,
      max: 500,
      value: 50,
      container,
      label: "",
    });

    const from = renderNumberInputTo({
      id: `${name}_from`,
      label: "from",
      container,
      value: 0,
    });

    from.addEventListener("change", () => {
      s.min = from.value;
    });

    to.addEventListener("change", () => {
      s.max = to.value;
    });

    return () => {
      const val = s.valueAsNumber;
      showValue(val);
      return val;
    };
  });
}
