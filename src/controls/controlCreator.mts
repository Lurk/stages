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

  const { add: addControl } = controls(vals, add, config);
  render({ vals, add, animate, addControl });

  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  return outputs;
}
