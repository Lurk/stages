import { Updater } from "../controls.mjs";
import {
  renderControl,
  renderNumberInputTo,
  renderRangeTo,
} from "../utils.mjs";
import { Values } from "../value.mjs";

export type SliderArgs = {
  min?: number;
  max?: number;
  value?: number;
  name: string;
};

export function sliderWithNumericInputs(
  values: Values,
  args: SliderArgs,
  onRemove: () => void,
): Updater {
  const { container, showValue } = renderControl(args.name, () => {
    values.unregister(args.name);
    onRemove();
  });

  showValue(args.value ?? 50);

  const to = renderNumberInputTo({
    id: `${args.name}_max`,
    label: "",
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
    id: `${args.name}_min`,
    label: "",
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

  values.register(args.name, () => {
    const val = s.valueAsNumber;
    showValue(val);
    return val;
  });

  return (control) => {
    if (control.type !== "slider") {
      throw new Error("Invalid control type");
    }

    if (control.args.name !== args.name) {
      throw new Error("Invalid control name");
    }

    s.min = String(control.args.min) ?? s.min;
    s.max = String(control.args.max) ?? s.max;
    s.value = String(control.args.value ?? s.value);
  };
}
