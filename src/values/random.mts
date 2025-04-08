import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { getOneNumber } from "../value.mjs";

export type RandomArgs = {
  name: string;
  min?: string | number;
  max?: string | number;
};

export function random({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<RandomArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    type: "random",
    onRemove: () => {
      state.values.unregister(args.name);
      onRemove();
      removeMin();
      removeMax();
    },
  });

  const componentState = { ...args };

  const {
    value: min,
    update: updateMin,
    onRemove: removeMin,
    state: stateMin,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_min`,
    label: "min",
    onChange(min) {
      onChange({ ...Object.assign(componentState, { min }) });
    },
  });
  const {
    value: max,
    update: updateMax,
    onRemove: removeMax,
    state: stateMax,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_max`,
    label: "max",
    onChange(max) {
      onChange({ ...Object.assign(componentState, { max }) });
    },
  });

  state.values.register(args.name, (now, i) => {
    const val =
      Math.random() * (getOneNumber(max(now, i)) - getOneNumber(min(now, i))) +
      getOneNumber(min(now, i));
    showValue(val.toPrecision(6));
    return [val];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);

    Object.assign(componentState, { min: stateMin(), max: stateMax() });
    onChange(componentState);
  }, 1);
}

export const randomSerde: ComponentSerde<RandomArgs> = () => {
  const keys = ["name", "min", "max"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(v, val, start) {
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
