import { renderSelectInputTo } from "../common/select.mjs";
import { Canvas } from "../../canvas.mjs";
import { Recorder } from "../../recorder.mjs";
import { button } from "../common/button.mjs";
import { divider } from "../common/divider.mjs";

export type CanvasArgs = {
  canvas: Canvas;
  container: HTMLDivElement;
  recorder: Recorder;
};

export function canvas({ canvas, container, recorder }: CanvasArgs) {
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
      canvas.resize(ls, shortSide);
    } else {
      canvas.resize(shortSide, ls);
    }
  };

  aspectRatio.addEventListener("change", () => {
    if (aspectRatio.value === "free") {
      longSide.disabled = true;
      orientation.disabled = true;
      canvas.resizeToFit();
    } else {
      longSide.disabled = false;
      orientation.disabled = false;
      changeCanvasSize();
    }
  });

  longSide.addEventListener("change", changeCanvasSize);
  orientation.addEventListener("change", changeCanvasSize);

  const rec = button({
    text: recorder.state() === "inactive" ? "record" : "stop",
    container,
    onClick: () => {
      if (recorder.state() === "inactive") {
        recorder.start();
      } else {
        recorder.stop();
      }
    },
  });
  recorder.subscribe((state) => rec(state === "inactive" ? "record" : "stop"));
}
