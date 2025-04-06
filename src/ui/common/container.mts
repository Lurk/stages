import { assert, limiter } from "../../utils.mjs";
import { button } from "./button.mjs";
import { spanWithText } from "./span.mjs";

export type ContainerArgs = {
  id: string;
  type?: string;
  isOutput?: boolean;
  onRemove?: () => void;
};

export type Container = {
  container: HTMLDivElement;
  showValue: (val: string) => void;
};

export function renderContainer({
  id,
  type,
  isOutput,
  onRemove,
}: ContainerArgs): Container {
  const root = document.getElementById("controls");
  assert(root, 'root element id="controls" not found');
  const container = document.createElement("div");
  const control = document.createElement("div");
  const name = document.createElement("h3");
  const value = spanWithText(container, "");
  const header = document.createElement("div");
  header.classList.add("header");

  const typeEl = document.createElement("span");
  typeEl.innerText = type ?? "";
  header.appendChild(typeEl);

  if (onRemove) {
    button({
      container: header,
      text: "x",
      onClick: () => {
        onRemove();
        control.remove();
      },
    });
  }

  control.classList.add("control");
  if (isOutput) {
    control.classList.add("output");
  }
  container.classList.add("inputs");
  name.innerText = `${id}:`;

  control.appendChild(header);
  control.appendChild(name);
  control.appendChild(container);
  root.appendChild(control);

  return {
    container,
    showValue: limiter(100, value),
  };
}
