import { Values } from "../value.mjs";

export function width(values: Values, ctx: CanvasRenderingContext2D) {
  values.register("width", () => ctx.canvas.width);
}

export function height(values: Values, ctx: CanvasRenderingContext2D) {
  values.register("height", () => ctx.canvas.height);
}

export function zero(values: Values) {
  values.register("zero", () => 0);
}

export function monotonic(values: Values) {
  values.register("i", (now, i) => i);
}
