import { Canvas, path } from "./canvas.mjs";
import { Output } from "./output.mjs";
import { getOneNumber } from "./utils.mjs";

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
  for (const output of outputs.values()) {
    switch (output.kind) {
      case "line":
        path({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.vertices(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
        });

        break;
      default:
        throw new Error(`Unknown output kind: ${output.kind}`);
    }
  }
}
