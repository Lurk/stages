import { path, initFullScreenCanvas } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { oscillatorWithConnectInput } from "./controls/oscillator.mjs";
import { sliderWithNumericInputs } from "./controls/slider.mjs";
import { controls } from "./controls.mjs";
import { height, monotonic, width, zero } from "./controls/defaults.mjs";

document.getElementById("fullscreen")?.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target instanceof HTMLElement) {
    e.target.requestFullscreen();
  }
});

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const { outputs, add } = initOutputs(ctrl);

createControlCreator(ctrl, add, animate);

width(ctrl, ctx);
height(ctrl, ctx);
zero(ctrl);
monotonic(ctrl);

sliderWithNumericInputs({
  ctrl,
  name: "x_t",
  min: 0.0001,
  max: 1,
  value: 0.4706,
});
oscillatorWithConnectInput({
  ctrl,
  name: "x",
  max: "width",
  min: "zero",
  raise: "x_t",
  fall: "x_t",
});
sliderWithNumericInputs({
  ctrl,
  name: "lfo_min",
  max: 0.7499,
  min: 0.7494,
  value: 0.7499,
});
sliderWithNumericInputs({
  ctrl,
  name: "lfo_max",
  max: 0.75,
  min: 0.7499,
  value: 0.74997,
});
sliderWithNumericInputs({
  ctrl,
  name: "lfo_t",
  max: 100_000,
  min: 2,
  value: 100_000,
});
oscillatorWithConnectInput({
  ctrl,
  name: "lfo",
  max: "lfo_max",
  min: "lfo_min",
  raise: "lfo_t",
  fall: "lfo_t",
});
oscillatorWithConnectInput({
  ctrl,
  name: "y",
  max: "height",
  min: "zero",
  raise: "lfo",
  fall: "lfo",
});
sliderWithNumericInputs({ ctrl, name: "sr", max: 2, min: 0.001, value: 1 });
sliderWithNumericInputs({
  ctrl,
  name: "vertices",
  max: 2000,
  min: 100,
  value: 650,
});
add({ name: "first", x: "x", y: "y", resolution: "sr", vertices: "vertices" });

let isRunning = true;

function animate() {
  requestAnimationFrame((now) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (const { y, x, resolution, vertices } of outputs.values()) {
      path({
        ctx,
        now,
        len: vertices(now, 0),
        resolution: resolution(now, 0),
        x,
        y,
      });
    }

    isRunning = true;
    animate();
  });
}

animate();

window.onerror = (e) => {
  alert(e);
  isRunning = false;
};
