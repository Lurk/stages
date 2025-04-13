import { CreatorConfig } from "../../factory.mjs";
import { Canvas } from "../../canvas.mjs";
import { controls } from "./controls.mjs";
import { canvas } from "./canvas.mjs";
import { assert } from "../../utils.mjs";
import { divider } from "../common/divider.mjs";
import { playback } from "./playback.mjs";
import { Animation } from "../../animation.mjs";

type RenderProps = {
  vals: any;
  canvas: Canvas;
  animation: Animation;
  add: (args: CreatorConfig) => void;
};

export function render(args: RenderProps) {
  const container = document.getElementById("factory");
  assert(container instanceof HTMLDivElement, "#factory element was not found");

  playback({
    animation: args.animation,
    canvas: args.canvas,
    container,
  });

  controls({
    container,
    add: args.add,
  });

  canvas({
    container,
    canvas: args.canvas,
  });

  divider({ container });

  const link = document.createElement("a");
  link.href = "https://github.com/Lurk/stages/blob/main/readme.md";
  link.textContent = "?";
  container.appendChild(link);
}
