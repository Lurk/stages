import { path, initFullScreenCanvas } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { oscillatorWithConnectInput } from "./controls/oscillator.mjs";
import { sliderWithNumericInputs } from "./controls/slider.mjs";
import { controls } from "./controls.mjs";
import { height, monotonic, width, zero } from "./controls/defaults.mjs";
import { random } from "./controls/random.mjs";

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

add("first");
width(ctrl, ctx);
height(ctrl, ctx);
zero(ctrl);
monotonic(ctrl);

oscillatorWithConnectInput(ctrl, "x");
oscillatorWithConnectInput(ctrl, "y");
sliderWithNumericInputs(ctrl, "sr");
sliderWithNumericInputs(ctrl, "t1");
sliderWithNumericInputs(ctrl, "t2");
sliderWithNumericInputs(ctrl, "dots");
random(ctrl, "random");

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
