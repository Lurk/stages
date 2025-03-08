import { Controls } from "../controls.mjs";
import { wave, connect } from "../value.mjs";
import { renderControl } from "../utils.mjs";

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
) {
  const { container, showValue } = renderControl(args.name, () =>
    ctrl.unregister(args.name),
  );

  const w = wave({
    min: connect(ctrl, args.name, {
      id: `${args.name}_min`,
      label: "min",
      selected: args.min,
      container,
    }),
    max: connect(ctrl, args.name, {
      id: `${args.name}_max`,
      label: "max",
      selected: args.max,
      container,
    }),
    raise: connect(ctrl, args.name, {
      id: `${args.name}_raise`,
      label: "raise",
      selected: args.raise,
      container,
    }),
    fall: connect(ctrl, args.name, {
      id: `${args.name}_fall`,
      label: "fall",
      selected: args.fall,
      container,
    }),
  });

  ctrl.register(args.name, (now, i) => {
    const val = w(now, i);
    showValue(val);
    return val;
  });
}
