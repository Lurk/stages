import { Controls } from "../controls.mjs";
import { wave, connect } from "../value.mjs";
import { renderControl } from "../utils.mjs";

export type OscillatorArgs = {
  ctrl: Controls;
  name: string;
  min?: string;
  max?: string;
  raise?: string;
  fall?: string;
};

export function oscillatorWithConnectInput(args: OscillatorArgs) {
  args.ctrl.register(args.name, () => {
    const { container, showValue } = renderControl(args.name, () =>
      args.ctrl.unregister(args.name),
    );

    const w = wave({
      min: connect(args.ctrl, args.name, {
        id: `${args.name}_min`,
        label: "min",
        selected: args.min,
        container,
      }),
      max: connect(args.ctrl, args.name, {
        id: `${args.name}_max`,
        label: "max",
        selected: args.max,
        container,
      }),
      raise: connect(args.ctrl, args.name, {
        id: `${args.name}_raise`,
        label: "raise",
        selected: args.raise,
        container,
      }),
      fall: connect(args.ctrl, args.name, {
        id: `${args.name}_fall`,
        label: "fall",
        selected: args.fall,
        container,
      }),
    });

    return (now, i) => {
      const val = w(now, i);
      showValue(val);
      return val;
    };
  });
}
