import { Controls } from "../controls.mjs";
import {
  renderControl,
  renderNumberInputTo,
  renderRangeTo,
} from "../utils.mjs";

export type SliderArgs = {
  min?: number;
  max?: number;
  value?: number;
  name: string;
};

export function sliderWithNumericInputs(ctrl: Controls, args: SliderArgs) {
  const { container, showValue } = renderControl(args.name, () =>
    ctrl.unregister(args.name),
  );

  showValue(args.value ?? 50);

  const to = renderNumberInputTo({
    id: `${args.name}_to`,
    label: "to",
    container,
    value: args.max ?? 500,
  });

  const s = renderRangeTo({
    id: args.name,
    max: args.max ?? 500,
    min: args.min ?? 0,
    value: args.value ?? 50,
    container,
    label: "",
  });

  const from = renderNumberInputTo({
    id: `${args.name}_from`,
    label: "from",
    container,
    value: args.min ?? 0,
  });

  from.addEventListener("change", () => {
    s.min = from.value;
  });

  to.addEventListener("change", () => {
    s.max = to.value;
  });

  s.value = String(args.value ?? 50);

  ctrl.register(args.name, () => {
    const val = s.valueAsNumber;
    showValue(val);
    return val;
  });
}
