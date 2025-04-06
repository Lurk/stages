import { CreatorConfig } from "../../factory.mjs";
import { renderContainer } from "../common/container.mjs";
import { Canvas } from "../../canvas.mjs";
import { controls } from "./controls.mjs";
import { canvas } from "./canvas.mjs";

type RenderProps = {
  vals: any;
  canvas: Canvas;
  add: (args: CreatorConfig) => void;
};

export function render(args: RenderProps) {
  const { container } = renderContainer({ id: "factory" });

  controls({
    container,
    add: args.add,
  });

  canvas({
    container,
    canvas: args.canvas,
  });

  const docs = document.createElement("div");
  docs.classList.add("docs");
  const link = document.createElement("a");
  link.href = "https://github.com/Lurk/stages/blob/main/readme.md";
  link.textContent = "documentation";
  docs.appendChild(link);
  container.parentNode?.appendChild(docs);
}
