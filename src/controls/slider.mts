import { ComponentSerde } from "../serde.mjs";
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
  const { container, showValue } = renderControl(args.name, false, () => {
    values.unregister(args.name);
    onRemove();
  });

  showValue((args.value ?? 50).toPrecision(6));

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

  const change = () =>
    onChange({
      name: args.name,
      min: s.min ? parseFloat(s.min) : 0,
      value: s.valueAsNumber,
      max: s.max ? parseFloat(s.max) : 500,
    });

  from.addEventListener("change", () => {
    s.min = from.value;
    change();
  });

  to.addEventListener("change", () => {
    s.max = to.value;
    change();
  });

  s.addEventListener("change", change);

  s.value = String(args.value ?? 50);

  values.register(args.name, () => {
    const val = s.valueAsNumber;
    showValue(val.toPrecision(6));
    return val;
  });

  change();
}

export const sliderSerde: ComponentSerde<SliderArgs> = (
  serialize,
  deserialize,
) => {
  const keys = ["name", "min", "value", "max"] as const;
  return {
    toString(args) {
      return keys
        .map((key) =>
          typeof args[key] === "string"
            ? serialize(args[key])
            : serialize(args[key]?.toString()),
        )

        .join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: SliderArgs = {
        name: "",
        min: 0,
        value: 0,
        max: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        if (key === "name") {
          res[key] = v;
        } else {
          res[key] = parseFloat(v);
        }
      });
      return { val: res, end: local_start };
    },
  };
};
