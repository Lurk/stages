import { initOutputs, Output } from "../outputs.mjs";
import { values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { controls, CreatorArgs } from "../controls.mjs";

export type InitArgs = {
  ctx: CanvasRenderingContext2D;
  animate: () => void;
  config: CreatorArgs[];
};

export function init({ animate, config, ctx }: InitArgs): Map<number, Output> {
  const vals = values();
  const { outputs, add } = initOutputs(vals);
  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  const { add: addControl } = controls(vals, add);
  render({ vals, add, animate, addControl });

  config.forEach((control) => {
    const updater = addControl(control);
    // TODO: come up with a better way to do this.
    // Because controls can be in random order, first, we need to create them all, and only then connect.
    // Somehow, without this timeout update doesn't work (at least in Safari).
    setTimeout(() => updater(control), 1);
  });

  return outputs;
}
