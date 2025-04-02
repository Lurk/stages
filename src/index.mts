import { path, initFullScreenCanvas } from "./canvas.mjs";
import { factory } from "./controls/factory.mjs";

const canvas = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#2b2a2a",
});

const outputs = factory({ canvas });

function animate() {
  requestAnimationFrame((now) => {
    canvas.ctx.fillStyle = "#2b2a2a";
    canvas.ctx.fillRect(
      0,
      0,
      canvas.ctx.canvas.width,
      canvas.ctx.canvas.height,
    );
    canvas.ctx.beginPath();
    canvas.ctx.strokeStyle = "#cccccc";
    canvas.ctx.lineWidth = 1;
    for (const { y, x, sr: resolution, vertices } of outputs.values()) {
      path({
        ctx: canvas.ctx,
        now,
        len: vertices(now, 0),
        resolution: resolution(now, 0),
        x,
        y,
      });
    }

    animate();
  });
}

animate();

window.onerror = (e) => {
  alert(`press browser back (works as undo) to fix the error: ${e}`);
};
