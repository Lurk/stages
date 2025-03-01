import { Stage } from "./stages.mjs";
import { assert } from "./utils.mjs";

type InitFullScreenCanvasArgs = {
  backgroundCollor: string;
  id: string;
};

export function initFullScreenCanvas({
  backgroundCollor,
  id,
}: InitFullScreenCanvasArgs): CanvasRenderingContext2D {
  const body = document.querySelector("body");
  assert(body, "body must be present");
  body.style.backgroundColor = backgroundCollor;

  const canvasElement = document.getElementById(id);
  assert(canvasElement, `canvas with id='${id}' must be present`);
  assert(
    canvasElement instanceof HTMLCanvasElement,
    `element with id='${id}' found but it is not canvas`,
  );
  const ctx = canvasElement.getContext("2d");
  assert(ctx, "could not get 2d context");
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  const observer = new ResizeObserver(() => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  });
  observer.observe(canvasElement);
  return ctx;
}

export type CreateMeterOpts = {
  ctx: CanvasRenderingContext2D;
  backgroundColor?: string;
  textColor?: string;
};

export type Meter = ({ key, value }: { key: string; value: string }) => void;

export function createMeter({
  ctx,
  backgroundColor = "#797d62",
  textColor = "#cabbb1",
}: CreateMeterOpts): Meter {
  const index: Map<string, number> = new Map();
  let maxWidth = 0;
  return ({ key, value }) => {
    let i = index.get(key);
    if (i === undefined) {
      i = index.size + 1;
      index.set(key, i);
    }
    const text = `${key}: ${value}`;
    ctx.font = "20px dsm";
    const size = ctx.measureText(text);
    if (size.width > maxWidth) {
      maxWidth = size.width;
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, (i - 1) * 25, maxWidth + 20, 30);

    ctx.fillStyle = textColor;
    ctx.fillText(text, 20, i * 25);
  };
}

export type PathOpts = {
  buffer: number[];
  ctx: CanvasRenderingContext2D;
  y?: (y: number) => number;
  x?: (x: number) => number;
};

export function path(opts: PathOpts) {
  opts.buffer.forEach((y, x) => {
    if (x === 0) {
      opts.ctx.moveTo(opts.x?.(x) || x, opts.y?.(y) || y);
    } else {
      opts.ctx.lineTo(opts.x?.(x) || x, opts.y?.(y) || y);
    }
  });
  opts.ctx.stroke();
}

export type BufferlessPathOptions = {
  len: number;
  resolution: number;
  now: number;
  ctx: CanvasRenderingContext2D;
  x: Stage;
  y: Stage;
};

export function buferlessPath(opts: BufferlessPathOptions) {
  const now = Math.floor(opts.now / opts.resolution) * opts.resolution;
  //console.log(now);
  opts.ctx.moveTo(opts.x.get(now, 0), opts.y.get(now, 0));
  const arr = [];
  for (let i = 1; i < opts.len; i++) {
    let foo = now + i * opts.resolution;
    arr.push(opts.y.get(foo, i));
    opts.ctx.lineTo(opts.x.get(foo, i), opts.y.get(foo, i));
  }
  //opts.y.cycle();
  //opts.x.cycle();
  //console.log(arr);
  opts.ctx.stroke();
}
