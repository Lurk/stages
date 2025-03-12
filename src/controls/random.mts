import { Updater } from "../controls.mjs";
import { renderControl } from "../utils.mjs";
import { Values } from "../value.mjs";
import { connect } from "./connect.mjs";

export type RandomArgs = {
  name: string;
  min?: string;
  max?: string;
};

type Args = {
  values: Values;
  args: RandomArgs;
  onRemove: () => void;
  onChange: (args: RandomArgs) => void;
};

export function random({ values, args, onRemove, onChange }: Args): Updater {
  const { container, showValue } = renderControl(args.name, () => {
    values.unregister(args.name);
    onRemove();
    removeMin();
    removeMax();
  });

  const state = { ...args };

  const {
    value: min,
    update: updateMin,
    onRemove: removeMin,
  } = connect({
    values,
    omit: args.name,
    args: {
      id: `${args.name}_min`,
      label: "min",
      container,
    },
    onChange(min) {
      onChange({ ...Object.assign(state, { min }) });
    },
  });
  const {
    value: max,
    update: updateMax,
    onRemove: removeMax,
  } = connect({
    values,
    omit: args.name,
    args: {
      id: `${args.name}_max`,
      label: "max",
      container,
    },
    onChange(max) {
      onChange({ ...Object.assign(state, { max }) });
    },
  });

  values.register(args.name, (now, i) => {
    const val = Math.random() * (max(now, i) - min(now, i)) + min(now, i);
    showValue(val);
    return val;
  });

  return (container) => {
    if (container.type !== "random") {
      throw new Error("Invalid container type");
    }

    if (container.args.name !== args.name) {
      throw new Error("Invalid container name");
    }

    updateMin(container.args.min);
    updateMax(container.args.max);
  };
}
