import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";

export type RandomArgs = {
  name: string;
  min?: string | number;
  max?: string | number;
};

export function random({
  values,
  args,
  onRemove,
  onChange,
}: ComponentArgs<RandomArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    type: "random",
    onRemove: () => {
      values.unregister(args.name);
      onRemove();
      removeMin();
      removeMax();
    },
  });

  const state = { ...args };

  const {
    value: min,
    update: updateMin,
    onRemove: removeMin,
    state: stateMin,
  } = connect({
    values,
    omit: args.name,
    container,
    id: `${args.name}_min`,
    label: "min",
    onChange(min) {
      onChange({ ...Object.assign(state, { min }) });
    },
  });
  const {
    value: max,
    update: updateMax,
    onRemove: removeMax,
    state: stateMax,
  } = connect({
    values,
    omit: args.name,
    container,
    id: `${args.name}_max`,
    label: "max",
    onChange(max) {
      onChange({ ...Object.assign(state, { max }) });
    },
  });

  values.register(args.name, (now, i) => {
    const val = Math.random() * (max(now, i) - min(now, i)) + min(now, i);
    showValue(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);

    Object.assign(state, { min: stateMin(), max: stateMax() });
    onChange(state);
  }, 1);
}

export const randomSerde: ComponentSerde<RandomArgs> = () => {
  const keys = ["name", "min", "max"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: RandomArgs = {
        name: "",
        min: 0,
        max: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (key === "name" && typeof v === "string") {
          res[key] = v;
        } else if (key !== "name") {
          res[key] = v;
        } else {
          throw new Error(`Invalid value for ${key}: ${v}`);
        }
        local_start = end;
      });
      return { val: res, end: local_start };
    },
  };
};
