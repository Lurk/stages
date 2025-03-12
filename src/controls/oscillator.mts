import { Values, wave } from "../value.mjs";
import { renderControl } from "../utils.mjs";
import { connect } from "./connect.mjs";
import { Updater } from "../controls.mjs";

export type OscillatorArgs = {
  name: string;
  min?: string;
  max?: string;
  raise?: string;
  fall?: string;
};

type Args = {
  values: Values;
  args: OscillatorArgs;
  onRemove: () => void;
  onChange: (args: OscillatorArgs) => void;
};

export function oscillatorWithConnectInput({
  values,
  args,
  onRemove,
  onChange,
}: Args): Updater {
  const { container, showValue } = renderControl(args.name, () => {
    values.unregister(args.name);
    onRemove();
    removeMin();
    removeMax();
    removeRaise();
    removeFall();
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
      selected: args.min,
      container,
    },
    onChange(min) {
      Object.assign(state, { min });
      onChange({ ...state });
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
      selected: args.max,
      container,
    },
    onChange(max) {
      Object.assign(state, { max });
      onChange({ ...state });
    },
  });
  const {
    value: raise,
    update: updateRaise,
    onRemove: removeRaise,
  } = connect({
    values,
    omit: args.name,
    args: {
      id: `${args.name}_raise`,
      label: "raise",
      selected: args.raise,
      container,
    },
    onChange(max) {
      Object.assign(state, { max });
      onChange({ ...state });
    },
  });
  const {
    value: fall,
    update: updateFall,
    onRemove: removeFall,
  } = connect({
    values,
    omit: args.name,
    args: {
      id: `${args.name}_fall`,
      label: "fall",
      selected: args.fall,
      container,
    },
    onChange(fall) {
      Object.assign(state, { fall });
      onChange({ ...state });
    },
  });

  const w = wave({
    min,
    max,
    raise,
    fall,
  });

  values.register(args.name, (now, i) => {
    const val = w(now, i);
    showValue(val);
    return val;
  });

  return (container) => {
    if (container.type !== "oscillator") {
      throw new Error("Invalid container type");
    }

    if (container.args.name !== args.name) {
      throw new Error("Invalid container name");
    }

    Object.assign(state, container.args);
    updateMin(container.args.min);
    updateMax(container.args.max);
    updateRaise(container.args.raise);
    updateFall(container.args.fall);
  };
}
