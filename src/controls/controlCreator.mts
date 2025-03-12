import { Output } from "../outputs.mjs";
import { values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { controls, CreatorConfig } from "../controls.mjs";

export type InitArgs = {
  ctx: CanvasRenderingContext2D;
  animate: () => void;
  config: CreatorConfig[];
};

export function init({ animate, config, ctx }: InitArgs): Map<string, Output> {
  const vals = values();
  const outputs: Map<string, Output> = new Map();
  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  const { add: addControl } = controls(vals, outputs);
  render({ vals, animate, addControl });

  config.forEach((control) => {
    const updater = addControl(control);
    // TODO: come up with a better way to do this.
    // Because controls can be in random order, first, we need to create them all, and only then connect.
    // Somehow, without this timeout update doesn't work (at least in Safari).
    setTimeout(() => updater(control), 1);
  });

  return outputs;
}
