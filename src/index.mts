import { path, initFullScreenCanvas } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { oscillatorWithConnectInput } from "./controls/oscillator.mjs";
import { sliderWithNumericInputs } from "./controls/slider.mjs";
import { controls } from "./controls.mjs";
import { height, monotonic, width, zero } from "./controls/defaults.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const { outputs, add } = initOutputs(ctrl);

createControlCreator(ctrl, add);
add("first");
width(ctrl, ctx);
height(ctrl, ctx);
zero(ctrl);
monotonic(ctrl);

oscillatorWithConnectInput(ctrl, "y");
oscillatorWithConnectInput(ctrl, "x");
sliderWithNumericInputs(ctrl, "sr");
sliderWithNumericInputs(ctrl, "t1");
sliderWithNumericInputs(ctrl, "t2");

function a() {
  requestAnimationFrame((now) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (const { y, x, resolution } of outputs.values()) {
      path({
        ctx,
        now,
        len: ctx.canvas.width,
        resolution: resolution(now, 0),
        x,
        y,
      });
    }

    a();
  });
}

a();
