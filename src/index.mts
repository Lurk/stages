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

sliderWithNumericInputs({ ctrl, name: "sr", min: 0.01, max: 10, value: 1 });
sliderWithNumericInputs({ ctrl, name: "t1", min: 0.01, max: 100, value: 37 });
sliderWithNumericInputs({ ctrl, name: "t2", min: 0.01, max: 100, value: 38 });
sliderWithNumericInputs({
  ctrl,
  name: "dots",
  min: 100,
  max: 2000,
  value: 1000,
});
oscillatorWithConnectInput({
  ctrl,
  name: "x",
  min: "zero",
  max: "width",
  raise: "t2",
  fall: "t2",
});
oscillatorWithConnectInput({
  ctrl,
  name: "y",
  min: "zero",
  max: "height",
  raise: "t1",
  fall: "t1",
});
add({ name: "first", x: "x", y: "y", resolution: "sr", dots: "dots" });

let isRunning = true;

function animate() {
  requestAnimationFrame((now) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (const { y, x, resolution, dots: len } of outputs.values()) {
      path({
        ctx,
        now,
        len: len(now, 0),
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
