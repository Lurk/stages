import { path, initFullScreenCanvas } from "./canvas.mjs";
import { initOutputs } from "./outputs.mjs";
import { initControls } from "./controls/controlCreator.mjs";
import { height, monotonic, width, zero } from "./controls/defaults.mjs";
import { fromString } from "./serde.mjs";
import { values } from "./value.mjs";

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

const vals = values();
const { outputs, add } = initOutputs(vals);

initControls({
  values: vals,
  addOutput: add,
  animate,
  controls: fromString(window.location.hash.slice(1)),
});

width(vals, ctx);
height(vals, ctx);
zero(vals);
monotonic(vals);

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
