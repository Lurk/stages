import { Controls } from "../controls.mjs";
import { renderControl } from "../utils.mjs";
import { connect } from "../value.mjs";

export type RandomArgs = {
  name: string;
};

export function random(ctrl: Controls, args: RandomArgs) {
  const { container, showValue } = renderControl(args.name, () =>
    ctrl.unregister(args.name),
  );

  const { value: min } = connect(ctrl, args.name, {
    id: `${args.name}_min`,
    label: "min",
    container,
  });
  const { value: max } = connect(ctrl, args.name, {
    id: `${args.name}_max`,
    label: "max",
    container,
  });

  ctrl.register(args.name, (now, i) => {
    const val = Math.random() * (max(now, i) - min(now, i)) + min(now, i);
    showValue(val);
    return val;
  });
}
