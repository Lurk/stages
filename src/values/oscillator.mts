import { Values, wave } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { deserialize, serialize } from "../utils.mjs";

export type OscillatorArgs = {
  name: string;
  min?: string | number;
  max?: string | number;
  raise?: string | number;
  fall?: string | number;
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
    state: stateMin,
  } = connect({
    values,
    omit: args.name,
    container,
    id: `${args.name}_min`,
    label: "min",
    value: args.min,
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
    value: args.max,
    onChange(max) {
      onChange({ ...Object.assign(state, { max }) });
    },
  });
  const {
    value: raise,
    update: updateRaise,
    onRemove: removeRaise,
    state: stateRaise,
  } = connect({
    values,
    omit: args.name,
    container,
    id: `${args.name}_raise`,
    label: "raise",
    value: args.raise,
    onChange(raise) {
      onChange({ ...Object.assign(state, { raise }) });
    },
  });
  const {
    value: fall,
    update: updateFall,
    onRemove: removeFall,
    state: stateFall,
  } = connect({
    values,
    omit: args.name,
    container,
    id: `${args.name}_fall`,
    label: "fall",
    value: args.fall,
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
      min: stateMin(),
      max: stateMax(),
      raise: stateRaise(),
      fall: stateFall(),
    });

    onChange(state);
  }, 1);
}

export const oscillatorSerde: ComponentSerde<OscillatorArgs> = () => {
  const keys = ["name", "min", "max", "raise", "fall"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: OscillatorArgs = {
        name: "",
        min: 0,
        max: 0,
        raise: 0,
        fall: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);

        if (key === "name" && typeof v === "string") {
          res.name = v;
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
