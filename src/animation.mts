import { Canvas, path } from "./canvas.mjs";
import { Output } from "./controls/line.mjs";

export type AnimateArgs = {
  canvas: Canvas;
  outputs: Map<string, Output>;
};

export function animate(args: AnimateArgs) {
  requestAnimationFrame((now) => {
    frame({ ...args, now });
    animate(args);
  });
}

export type FrameArgs = {
  canvas: Canvas;
  outputs: Map<string, Output>;
  now: number;
};

export function frame({ canvas, outputs, now }: FrameArgs) {
  canvas.ctx.fillStyle = "#2b2a2a";
  canvas.ctx.fillRect(0, 0, canvas.ctx.canvas.width, canvas.ctx.canvas.height);
  canvas.ctx.beginPath();
  canvas.ctx.strokeStyle = "#cccccc";
  canvas.ctx.lineWidth = 1;
  for (const { y, x, sr: resolution, vertices } of outputs.values()) {
    path({
      ctx: canvas.ctx,
      now,
      len: vertices(now, 0),
      resolution: resolution(now, 0),
      x,
      y,
    });
  }
}
