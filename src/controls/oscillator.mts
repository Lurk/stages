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

export function oscillatorWithConnectInput(
  values: Values,
  args: OscillatorArgs,
  onRemove: () => void,
): Updater {
  const { container, showValue } = renderControl(args.name, () => {
    values.unregister(args.name);
    onRemove();
  });

  const { value: min, update: updateMin } = connect(values, args.name, {
    id: `${args.name}_min`,
    label: "min",
    selected: args.min,
    container,
  });
  const { value: max, update: updateMax } = connect(values, args.name, {
    id: `${args.name}_max`,
    label: "max",
    selected: args.max,
    container,
  });
  const { value: raise, update: updateRaise } = connect(values, args.name, {
    id: `${args.name}_raise`,
    label: "raise",
    selected: args.raise,
    container,
  });
  const { value: fall, update: updateFall } = connect(values, args.name, {
    id: `${args.name}_fall`,
    label: "fall",
    selected: args.fall,
    container,
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

    updateMin(container.args.min);
    updateMax(container.args.max);
    updateRaise(container.args.raise);
    updateFall(container.args.fall);
  };
}
