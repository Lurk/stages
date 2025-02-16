import { initFullScreenCanvas, path } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { oscillatorWithConnectInput } from "./controls/oscillator.mjs";
import { sliderWithNumericInputs } from "./controls/slider.mjs";
import { controls } from "./controls.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const { outputs, add } = initOutputs(ctrl, ctx);

createControlCreator(ctrl, add);
add("first");

sliderWithNumericInputs(ctrl, "speed");
sliderWithNumericInputs(ctrl, "min");
sliderWithNumericInputs(ctrl, "max");
sliderWithNumericInputs(ctrl, "time");
oscillatorWithConnectInput(ctrl, "main");

function a() {
  requestAnimationFrame((now) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    outputs.values().forEach(({ selector, buffer, speed }) => {
      buffer.resize(ctx.canvas.width);
      const selectedControl = selector.value;
      buffer.push(ctrl.get(selectedControl)?.get(now) ?? 0);
      path({
        buffer: buffer.iter(),
        ctx,
        x: (x) =>
          x === 0 ? ctx.canvas.width : ctx.canvas.width - x * speed.get(now),
        y: (y) => y,
      });
    });
    a();
  });
}

a();
