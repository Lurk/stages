import { Values, wave } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";

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
}: Args) {
  const { container, showValue } = renderContainer(args.name, false, () => {
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
    selected: selectedMin,
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
      selected: args.max,
      container,
    },
    onChange(max) {
      onChange({ ...Object.assign(state, { max }) });
    },
  });
  const {
    value: raise,
    update: updateRaise,
    onRemove: removeRaise,
    selected: selectedRaise,
  } = connect({
    values,
    omit: args.name,
    args: {
      id: `${args.name}_raise`,
      label: "raise",
      selected: args.raise,
      container,
    },
    onChange(raise) {
      onChange({ ...Object.assign(state, { raise }) });
    },
  });
  const {
    value: fall,
    update: updateFall,
    onRemove: removeFall,
    selected: selectedFall,
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
      onChange({ ...Object.assign(state, { fall }) });
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
    showValue(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);
    updateRaise(args.raise);
    updateFall(args.fall);

    Object.assign(state, {
      min: selectedMin(),
      max: selectedMax(),
      raise: selectedRaise(),
      fall: selectedFall(),
    });

    onChange(state);
  }, 1);
}

export const oscillatorSerde: ComponentSerde<OscillatorArgs> = (
  serialize,
  deserialize,
) => {
  const keys = ["name", "min", "max", "raise", "fall"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: OscillatorArgs = {
        name: "",
        min: "",
        max: "",
        raise: "",
        fall: "",
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
};
