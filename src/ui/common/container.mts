import { assert, limiter } from "../../utils.mjs";
import { spanWithText } from "./span.mjs";

export function renderContainer(
  id: string,
  isOutput?: boolean,
  onremove?: () => void,
): {
  container: HTMLDivElement;
  showValue(val: string): void;
} {
  const root = document.getElementById("controls");
  assert(root, 'root element id="controls" not found');
  const container = document.createElement("div");
  const control = document.createElement("div");
  const header = document.createElement("h3");
  const value = spanWithText(container, "");

  if (onremove) {
    const remove = document.createElement("button");
    remove.classList.add("remove");
    remove.innerText = "x";
    remove.onclick = () => {
      onremove();
      control.remove();
    };
    control.appendChild(remove);
  }

  control.classList.add("control");
  if (isOutput) {
    control.classList.add("output");
  }
  container.classList.add("inputs");
  header.innerText = `${id}:`;

  root.appendChild(control);
  control.appendChild(header);
  control.appendChild(container);

  return {
    container,
    showValue: limiter(100, value),
  };
}
