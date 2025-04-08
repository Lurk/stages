import { getFourNumbers, getOneNumber, Value } from "./value.mjs";
import { assert } from "./utils.mjs";

type InitFullScreenCanvasArgs = {
  backgroundCollor: string;
  id: string;
};

export type Canvas = {
  ctx: CanvasRenderingContext2D;
  resize: (width: number, height: number) => void;
  resizeToFit: () => void;
};

export function initFullScreenCanvas({
  backgroundCollor,
  id,
}: InitFullScreenCanvasArgs): Canvas {
  const body = document.querySelector("body");
  assert(body, "body must be present");
  body.style.backgroundColor = backgroundCollor;

  const canvasElement = document.getElementById(id);
  assert(canvasElement, `canvas with id='${id}' must be present`);
  canvasElement.style.backgroundColor = backgroundCollor;
  assert(
    canvasElement instanceof HTMLCanvasElement,
    `element with id='${id}' found but it is not canvas`,
  );
  const ctx = canvasElement.getContext("2d");
  assert(ctx, "could not get 2d context");

  const dpr = window.devicePixelRatio;
  const rect = canvasElement.getBoundingClientRect();

  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  let observer = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      const rect = canvasElement.getBoundingClientRect();

      canvasElement.width = rect.width * dpr;
      canvasElement.height = rect.height * dpr;
    });
  });
  observer.observe(canvasElement);
  return {
    ctx,
    resize(width, height) {
      canvasElement.classList.remove("fit");
      canvasElement.width = width;
      canvasElement.height = height;
      canvasElement.style.width = `${width / dpr}px`;
      canvasElement.style.height = `${height / dpr}px`;
      observer.disconnect();
    },
    resizeToFit() {
      canvasElement.classList.add("fit");
      const rect = canvasElement.getBoundingClientRect();
      canvasElement.width = rect.width * dpr;
      canvasElement.height = rect.height * dpr;
      canvasElement.style.width = "";
      canvasElement.style.height = "";
      observer = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const rect = canvasElement.getBoundingClientRect();

          canvasElement.width = rect.width * dpr;
          canvasElement.height = rect.height * dpr;
        });
      });
      observer.observe(canvasElement);
    },
  };
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

export type PathArgs = {
  len: number;
  sampleRate: number;
  now: number;
  ctx: CanvasRenderingContext2D;
  x: Value;
  y: Value;
  color: Value;
};

export function path(args: PathArgs) {
  const now = Math.floor(args.now / args.sampleRate) * args.sampleRate;
  args.ctx.beginPath();
  args.ctx.moveTo(getOneNumber(args.x(now, 0)), getOneNumber(args.y(now, 0)));
  args.ctx.strokeStyle = "#cccccc";
  args.ctx.lineWidth = 1;
  for (let i = 1; i < args.len; i++) {
    const color = args.color(now + i * args.sampleRate, i);
    if (color.length === 4) {
      args.ctx.strokeStyle = `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;
    }
    let foo = now + i * args.sampleRate;
    args.ctx.lineTo(getOneNumber(args.x(foo, i)), getOneNumber(args.y(foo, i)));
  }
  args.ctx.stroke();
}

export type BoxArgs = {
  x: Value;
  y: Value;
  width: Value;
  height: Value;
  color: Value;
  len: number;
  sampleRate: number;
  now: number;
  ctx: CanvasRenderingContext2D;
};

export function box(args: BoxArgs) {
  const now = Math.floor(args.now / args.sampleRate) * args.sampleRate;
  for (let i = 0; i < args.len; i++) {
    const x = getOneNumber(args.x(now + i * args.sampleRate, i));
    const y = getOneNumber(args.y(now + i * args.sampleRate, i));
    const width = getOneNumber(args.width(now + i * args.sampleRate, i));
    const height = getOneNumber(args.height(now + i * args.sampleRate, i));
    const color = getFourNumbers(args.color(now + i * args.sampleRate, i));

    args.ctx.fillStyle = `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;

    args.ctx.fillRect(x, y, width, height);
  }
}

export type CircleArgs = {
  x: Value;
  y: Value;
  radius: Value;
  color: Value;
  sampleRate: number;
  len: number;
  now: number;
  ctx: CanvasRenderingContext2D;
};

export function circle(args: CircleArgs) {
  const now = Math.floor(args.now / args.sampleRate) * args.sampleRate;
  for (let i = 0; i < args.len; i++) {
    const x = getOneNumber(args.x(now + i * args.sampleRate, i));
    const y = getOneNumber(args.y(now + i * args.sampleRate, i));
    const radius = getOneNumber(args.radius(now + i * args.sampleRate, i));
    const color = getFourNumbers(args.color(now + i * args.sampleRate, i));

    args.ctx.fillStyle = `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;

    args.ctx.beginPath();
    args.ctx.arc(x, y, radius, 0, Math.PI * 2);
    args.ctx.fill();
  }
}
