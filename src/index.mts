import { initFullScreenCanvas, path } from "./canvas.mjs";
import { controls, slider } from "./stages.mjs";
import { initOutputs } from "./outputs.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { assert } from "./utils.mjs";
import { oscillatorWithConnectInput } from "./controls/oscillator.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const outputs = initOutputs(ctx.canvas.width, ctrl);

ctrl.register("min", slider({ id: "min", max: 500, value: 0 }));
ctrl.register("max", slider({ id: "max", max: 500, value: 50 }));
ctrl.register("time", slider({ id: "time", max: 5000, value: 50 }));
oscillatorWithConnectInput(ctrl, "main");

const controlsContainer = document.getElementById("control-creation");
assert(
  controlsContainer instanceof HTMLDivElement,
  "control creation root is not found",
);
createControlCreator(controlsContainer, ctrl);

function a() {
  requestAnimationFrame((now) => {
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
        y: (y) => y,
      });
    });
    a();
  });
}

a();
