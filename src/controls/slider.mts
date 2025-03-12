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

export type Args = {
  values: Values;
  args: SliderArgs;
  onRemove: () => void;
  onChange: (args: SliderArgs) => void;
};

export function sliderWithNumericInputs({
  values,
  args,
  onRemove,
  onChange,
}: Args) {
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
    onChange({
      name: args.name,
      min: parseFloat(s.min),
      value: s.valueAsNumber,
      max: parseFloat(s.max),
    });
  });

  to.addEventListener("change", () => {
    s.max = to.value;
    onChange({
      name: args.name,
      min: parseFloat(s.min),
      value: s.valueAsNumber,
      max: parseFloat(s.max),
    });
  });

  s.addEventListener("change", () => {
    onChange({
      name: args.name,
      min: parseFloat(s.min),
      value: s.valueAsNumber,
      max: parseFloat(s.max),
    });
  });

  s.value = String(args.value ?? 50);

  values.register(args.name, () => {
    const val = s.valueAsNumber;
    showValue(val);
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    s.min = String(args.min) ?? s.min;
    s.max = String(args.max) ?? s.max;
    s.value = String(args.value ?? s.value);
  }, 1);
}
