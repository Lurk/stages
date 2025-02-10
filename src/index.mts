import { createBuffer } from "./buffer.mjs";
import { initFullScreenCanvas, path } from "./canvas.mjs";
import { controls } from "./stages.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();

const outputSelector = document.createElement("select");
outputSelector.id = "output-selector";
document.getElementById("control-creation")?.appendChild(outputSelector);

const controlsContainer = document.getElementById("control-creation");
if (controlsContainer) {
  createControlCreator(controlsContainer, ctrl, outputSelector);
}

const buffer = createBuffer(Math.round(ctx.canvas.width));

function a() {
  requestAnimationFrame((now) => {
    buffer.resize(ctx.canvas.width);
    const vHalf = ctx.canvas.height / 2;
    const selectedControl = outputSelector.value;
    buffer.push(ctrl.get(selectedControl)?.get(now) ?? 0);
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => ctx.canvas.width - x,
      y: (y) => vHalf - 500 / 2 + y,
    });
    a();
  });
}

a();
