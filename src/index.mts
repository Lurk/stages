import { createBuffer } from "./buffer.mjs";
import { initFullScreenCanvas, path } from "./canvas.mjs";
import { constant, controls, slider, wave, connect } from "./stages.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const max = 500;

ctrl.register("slider", slider({ id: "slider", max: 500, value: 50 }));

ctrl.register(
  "lfo",
  wave({
    min: constant(1),
    max: constant(500),
    raise: constant(50000),
    fall: constant(50000),
  }),
);

const w = wave({
  max: connect(ctrl, { label: "max" }),
  min: connect(ctrl, { label: "min", value: "lfo" }),
  raise: connect(ctrl, { label: "raise", value: "slider" }),
  fall: connect(ctrl, { label: "fall", value: "slider" }),
});

const buffer = createBuffer(Math.round(ctx.canvas.width));

function a() {
  requestAnimationFrame((now) => {
    buffer.resize(ctx.canvas.width);
    const vHalf = ctx.canvas.height / 2;
    buffer.push(w.get(now));
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 1,
      y: (y) => vHalf - max / 2 + y,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 2,
      y: (y) => vHalf - max / 2 + y + 125,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 3,
      y: (y) => vHalf - max / 2 + y + 250,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 4,
      y: (y) => vHalf - max / 2 + y + 375,
    });

    a();
  });
}

a();
