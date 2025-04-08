import { box, Canvas, circle, path } from "./canvas.mjs";
import { Output } from "./output.mjs";
import { getOneNumber } from "./value.mjs";

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
          color: output.value.color,
        });
        break;
      case "box":
        box({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.amount(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
          width: output.value.width,
          height: output.value.height,
          color: output.value.color,
        });
        break;
      case "circle":
        circle({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.amount(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
          radius: output.value.radius,
          color: output.value.color,
        });
        break;
      default:
        //@ts-expect-error
        throw new Error(`Unknown output kind: ${output.kind}`);
    }
  }
}
