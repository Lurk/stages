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

export function one(values: Values) {
  values.register("one", () => 1);
}

export function two(values: Values) {
  values.register("two", () => 2);
}

export function monotonic(values: Values) {
  values.register("i", (now, i) => i);
}

export function now(values: Values) {
  values.register("now", (now, i) => now);
}
