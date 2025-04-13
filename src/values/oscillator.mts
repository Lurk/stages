import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { getOneNumber, Value } from "../value.mjs";

type WaveOpts = {
  min: Value;
  max: Value;
  raise: Value;
  fall: Value;
};

function wave(opts: WaveOpts): Value {
  return (now, i) => {
    const raise = getOneNumber(opts.raise(now, i));
    const fall = getOneNumber(opts.fall(now, i));
    const min = getOneNumber(opts.min(now, i));
    const max = getOneNumber(opts.max(now, i));

    const duration = fall + raise;

    const beginigOfCycle = Math.floor(now / duration) * duration;
    const since = now - beginigOfCycle;
    const distance = max - min;

    if (since < raise) {
      const speed = distance / raise;
      const distanceCovered = since * speed;
      return [min + distanceCovered];
    } else {
      const speed = distance / fall;
      const distanceCovered = (since - raise) * speed;
      return [max - distanceCovered];
    }
  };
}

export type OscillatorArgs = {
  name: string;
  min?: string | number;
  max?: string | number;
  raise?: string | number;
  fall?: string | number;
};

export function oscillatorWithConnectInput({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<OscillatorArgs>) {
  const container = renderContainer({
    id: args.name,
    type: "oscillator",
  });

  container.onRemove(() => {
    state.values.unregister(args.name);
    onRemove();
  });

  let componentState: Readonly<OscillatorArgs> = { ...args };

  const {
    value: min,
    update: updateMin,
    state: stateMin,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_min`,
    label: "min",
    value: args.min,
    onChange(min) {
      componentState = { ...componentState, min };
      onChange(componentState);
    },
  });
  const {
    value: max,
    update: updateMax,
    state: stateMax,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_max`,
    label: "max",
    value: args.max,
    onChange(max) {
      componentState = { ...componentState, max };
      onChange(componentState);
    },
  });
  const {
    value: raise,
    update: updateRaise,
    state: stateRaise,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_raise`,
    label: "raise",
    value: args.raise,
    onChange(raise) {
      componentState = { ...componentState, raise };
      onChange(componentState);
    },
  });
  const {
    value: fall,
    update: updateFall,
    state: stateFall,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_fall`,
    label: "fall",
    value: args.fall,
    onChange(fall) {
      componentState = { ...componentState, fall };
      onChange(componentState);
    },
  });

  const w = wave({
    min,
    max,
    raise,
    fall,
  });

  state.values.register(args.name, (now, i) => {
    const val = getOneNumber(w(now, i));
    container.showValue(val.toPrecision(6));
    return [val];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);
    updateRaise(args.raise);
    updateFall(args.fall);

    Object.assign(componentState, {
      min: stateMin(),
      max: stateMax(),
      raise: stateRaise(),
      fall: stateFall(),
    });

    onChange(componentState);
  }, 1);
}

export const oscillatorSerde: ComponentSerde<OscillatorArgs> = () => {
  const keys = ["name", "min", "max", "raise", "fall"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(v, val, start) {
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
