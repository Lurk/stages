import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { numberInput } from "../ui/common/number_input.mjs";
import { renderRangeTo } from "../ui/common/range.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";

export type SliderArgs = {
  min?: number;
  max?: number;
  value?: number;
  name: string;
};

export function sliderWithNumericInputs({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<SliderArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    onRemove: () => {
      state.values.unregister(args.name);
      onRemove();
    },
  });

  showValue((args.value ?? 50).toPrecision(6));

  const to = numberInput({
    id: `${args.name}_max`,
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

  const from = numberInput({
    id: `${args.name}_min`,
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

  state.values.register(args.name, () => {
    const val = s.valueAsNumber;
    showValue(val.toPrecision(6));
    return [val];
  });

  change();
}

export const sliderSerde: ComponentSerde<SliderArgs> = () => {
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

    fromString(v, val, start) {
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
        if (key === "name" && typeof v === "string") {
          res[key] = v;
        } else if (key !== "name" && typeof v === "number") {
          res[key] = v;
        } else if (key !== "name" && typeof v === "string") {
          res[key] = parseFloat(v);
        } else {
          throw new Error(`Invalid value for ${key}: ${v}`);
        }
      });
      return { val: res, end: local_start };
    },
  };
};
