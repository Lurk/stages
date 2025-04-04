import {
  CONTROL_TYPES,
  controlTypeGuard,
  CreatorConfig,
} from "../controls/factory.mjs";
import { Recorder } from "../recorder.mjs";
import { button } from "./common/button.mjs";
import { renderContainer } from "./common/container.mjs";
import { renderSelectInputTo } from "./common/select.mjs";
import { renderTextInputTo } from "./common/text_input.mjs";
import { Canvas } from "../canvas.mjs";
import { divider } from "./common/divider.mjs";

type RenderProps = {
  vals: any;
  canvas: Canvas;
  add: (args: CreatorConfig) => void;
  recorder: Recorder;
};

export function render(args: RenderProps) {
  const { container } = renderContainer("factory");

  const nameInput = renderTextInputTo({
    label: "name:",
    container,
  });

  const { el: controlTypeSelect } = renderSelectInputTo({
    container,
    options: CONTROL_TYPES,
    id: "control-creation-select",
    label: "type:",
  });

  button({
    text: "Create Control",
    container,
    onClick: () => {
      const type = controlTypeSelect.value;
      const name = nameInput.value.trim();

      if (!controlTypeGuard(type)) {
        alert("Invalid control type");
        return;
      }
      args.add({ type, args: { name } });
      nameInput.value = "";
    },
  });

  divider({
    container,
    label: "canvas",
  });

  const { el: aspectRatio } = renderSelectInputTo({
    container,
    options: ["free", "1:1", "16:9", "5:4", "4:3", "2:1"],
    id: "aspect-ratio",
    label: "aspect ratio:",
  });

  const { el: orientation } = renderSelectInputTo({
    container,
    options: ["horizontal", "vertical"],
    id: "orientation",
    label: "orientation:",
    disabled: true,
  });

  const { el: longSide } = renderSelectInputTo({
    container,
    options: ["4096", "2048", "1024", "512", "256", "128"],
    id: "long-side",
    label: "long side (px):",
    disabled: true,
  });

  const changeCanvasSize = () => {
    const ar = aspectRatio.value;
    const ls = parseInt(longSide.value);
    const o = orientation.value;
    const shortSide = Math.round(
      (ls / parseInt(ar.split(":")[0])) * parseInt(ar.split(":")[1]),
    );

    if (o === "horizontal") {
      args.canvas.resize(ls, shortSide);
    } else {
      args.canvas.resize(shortSide, ls);
    }
  };

  aspectRatio.addEventListener("change", () => {
    if (aspectRatio.value === "free") {
      longSide.disabled = true;
      orientation.disabled = true;
      args.canvas.resizeToFit();
    } else {
      longSide.disabled = false;
      orientation.disabled = false;
      changeCanvasSize();
    }
  });

  longSide.addEventListener("change", changeCanvasSize);
  orientation.addEventListener("change", changeCanvasSize);

  const rec = button({
    text: args.recorder.state() === "inactive" ? "record" : "stop",
    container,
    onClick: () => {
      if (args.recorder.state() === "inactive") {
        args.recorder.start();
      } else {
        args.recorder.stop();
      }
    },
  });
  args.recorder.subscribe((state) =>
    rec(state === "inactive" ? "record" : "stop"),
  );

  const docs = document.createElement("div");
  docs.classList.add("docs");
  const link = document.createElement("a");
  link.href = "https://github.com/Lurk/stages/blob/main/readme.md";
  link.textContent = "documentation";
  docs.appendChild(link);
  container.parentNode?.appendChild(docs);
}
