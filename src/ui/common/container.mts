import { assert, limiter } from "../../utils.mjs";
import { button } from "./button.mjs";
import { spanWithText } from "./span.mjs";

export type ContainerArgs = {
  id: string;
  type?: string;
  isOutput?: boolean;
};

export type Container = {
  el: HTMLDivElement;
  showValue: (val: string) => void;
  onRemove: (cb: () => void) => void;
};

export function renderContainer({
  id,
  type,
  isOutput,
}: ContainerArgs): Container {
  const onRemoveCallbacks: (() => void)[] = [];
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

  button({
    container: header,
    text: "x",
    onClick: () => {
      onRemoveCallbacks.forEach((cb) => cb());
      control.remove();
    },
  });

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
    el: container,
    showValue: limiter(100, value),
    onRemove: (cb) => {
      onRemoveCallbacks.push(cb);
    },
  };
}
