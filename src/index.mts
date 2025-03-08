import { path, initFullScreenCanvas } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { initControls } from "./controls/controlCreator.mjs";
import { controls } from "./controls.mjs";
import { height, monotonic, width, zero } from "./controls/defaults.mjs";
import { initial } from "./configs/2.mjs";

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

initControls({
  ctrl,
  addOutput: add,
  animate,
  controls: initial,
});

width(ctrl, ctx);
height(ctrl, ctx);
zero(ctrl);
monotonic(ctrl);

let isRunning = true;

function animate() {
  requestAnimationFrame((now) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (const { y, x, sr: resolution, vertices } of outputs.values()) {
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
