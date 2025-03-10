import { initOutputs, Output } from "../outputs.mjs";
import { values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { creator, CreatorArgs } from "../controls.mjs";

export type InitArgs = {
  ctx: CanvasRenderingContext2D;
  animate: () => void;
  controls: CreatorArgs[];
};

export function init({
  animate,
  controls,
  ctx,
}: InitArgs): Map<number, Output> {
  const vals = values();
  const { outputs, add } = initOutputs(vals);

  render({ vals, add, animate });

  const u = controls.map((control) => ({
    updater: creator(vals, add, control),
    control,
  }));

  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    u.forEach(({ updater, control }) => updater(control));
  }, 10);

  return outputs;
}
