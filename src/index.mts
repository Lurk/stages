import { createBuffer } from "./buffer.mjs";
import { initFullScreenCanvas, path } from "./canvas.mjs";
import {
  constant,
  controls,
  slider,
  wave,
  connect,
  inputNumber,
  Controls,
} from "./stages.mjs";
import { getOrCreateControl } from "./utils.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});

const ctrl = controls();
const max = 500;

ctrl.register("s", slider({ id: "s", max: 500, value: 50 }));
ctrl.register("s1", slider({ id: "s1", max: 500, value: 50 }));
ctrl.register("s2", slider({ id: "s2", max: 500, value: 50 }));
ctrl.register("s3", slider({ id: "s3", max: 500, value: 50 }));

function oscillatorWithNumericInputs(ctrl: Controls, id: string) {
  const lfoContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  lfoContainer.appendChild(header);
  const controls = document.createElement("div");
  controls.classList.add("controls");
  lfoContainer.appendChild(controls);
  ctrl.register(
    id,
    wave({
      min: slider({
        id: `${id}_min`,
        label: "min",
        value: 50,
        max: 500,
        container: controls,
      }),
      max: slider({
        id: `${id}_max`,
        label: "max",
        value: 50,
        max: 500,
        container: controls,
      }),
      raise: slider({
        id: `${id}_raise`,
        label: "raise",
        value: 50,
        max: 500,
        container: controls,
      }),
      fall: slider({
        id: `${id}_fall`,
        label: "fall",
        value: 50,
        max: 500,
        container: controls,
      }),
    }),
  );
}

function oscillatorWithConnectInput(ctrl: Controls, id: string) {
  const wContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  wContainer.appendChild(header);
  ctrl.register(
    id,
    wave({
      min: connect(ctrl, {
        id: `${id}_min`,
        label: "min",
        container: wContainer,
      }),
      max: connect(ctrl, {
        id: `${id}_max`,
        label: "max",
        container: wContainer,
      }),
      raise: connect(ctrl, {
        id: `${id}_raise`,
        label: "raise",
        container: wContainer,
      }),
      fall: connect(ctrl, {
        id: `${id}_fall`,
        label: "fall",
        container: wContainer,
      }),
    }),
  );
}

oscillatorWithNumericInputs(ctrl, "lfo");
oscillatorWithNumericInputs(ctrl, "lfo2");

oscillatorWithConnectInput(ctrl, "connected");
oscillatorWithConnectInput(ctrl, "main");

const buffer = createBuffer(Math.round(ctx.canvas.width));

function a() {
  requestAnimationFrame((now) => {
    buffer.resize(ctx.canvas.width);
    const vHalf = ctx.canvas.height / 2;
    buffer.push(ctrl.get("main")?.get(now) ?? 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 1,
      y: (y) => vHalf - max / 2 + y,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 2,
      y: (y) => vHalf - max / 2 + y + 125,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 3,
      y: (y) => vHalf - max / 2 + y + 250,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * 4,
      y: (y) => vHalf - max / 2 + y + 375,
    });

    a();
  });
}

a();
