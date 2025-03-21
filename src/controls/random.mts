import { on, setMaxListeners } from "events";
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

export function random({ values, args, onRemove, onChange }: Args) {
  const { container, showValue } = renderControl(args.name, false, () => {
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
    selected: selectedMin,
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
    selected: selectedMax,
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
    showValue(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);

    Object.assign(state, { min: selectedMin(), max: selectedMax() });
    onChange(state);
  }, 1);
}
