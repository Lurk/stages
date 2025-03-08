import { Controls } from "../controls.mjs";

export function width(ctrl: Controls, ctx: CanvasRenderingContext2D) {
  ctrl.register("width", () => ctx.canvas.width);
}

export function height(ctrl: Controls, ctx: CanvasRenderingContext2D) {
  ctrl.register("height", () => ctx.canvas.height);
}

export function zero(ctrl: Controls) {
  ctrl.register("zero", () => 0);
}

export function monotonic(ctrl: Controls) {
  ctrl.register("i", (now, i) => i);
}
