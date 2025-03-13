import { Output } from "./line.mjs";
import { values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { controls } from "../controls.mjs";

export type InitArgs = {
  ctx: CanvasRenderingContext2D;
  animate: () => void;
};

export function init({ animate, ctx }: InitArgs): Map<string, Output> {
  const vals = values();
  const outputs: Map<string, Output> = new Map();
  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  const { add } = controls(vals, outputs);
  render({ vals, animate, add });

  return outputs;
}
