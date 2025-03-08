import { Controls } from "../controls.mjs";
import { wave, connect } from "../value.mjs";
import { renderControl } from "../utils.mjs";
import { Updater } from "./controlCreator.mjs";

export type OscillatorArgs = {
  name: string;
  min?: string;
  max?: string;
  raise?: string;
  fall?: string;
};

export function oscillatorWithConnectInput(
  ctrl: Controls,
  args: OscillatorArgs,
): Updater {
  const { container, showValue } = renderControl(args.name, () =>
    ctrl.unregister(args.name),
  );

  const { value: min, update: updateMin } = connect(ctrl, args.name, {
    id: `${args.name}_min`,
    label: "min",
    selected: args.min,
    container,
  });
  const { value: max, update: updateMax } = connect(ctrl, args.name, {
    id: `${args.name}_max`,
    label: "max",
    selected: args.max,
    container,
  });
  const { value: raise, update: updateRaise } = connect(ctrl, args.name, {
    id: `${args.name}_raise`,
    label: "raise",
    selected: args.raise,
    container,
  });
  const { value: fall, update: updateFall } = connect(ctrl, args.name, {
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

  ctrl.register(args.name, (now, i) => {
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
