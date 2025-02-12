import { initFullScreenCanvas, path } from "./canvas.mjs";
import { controls } from "./stages.mjs";
import { initOutputs } from "./outputs.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const outputs = initOutputs(ctx.canvas.width, ctrl);

function a() {
  requestAnimationFrame((now) => {
    const vHalf = ctx.canvas.height / 2;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    outputs.values().forEach(({ selector, buffer }) => {
      buffer.resize(ctx.canvas.width);
      const selectedControl = selector.value;
      buffer.push(ctrl.get(selectedControl)?.get(now) ?? 0);
      path({
        buffer: buffer.iter(),
        ctx,
        x: (x) => ctx.canvas.width - x,
        y: (y) => vHalf - 500 / 2 + y,
      });
    });
    a();
  });
}

a();
