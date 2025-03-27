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

type RenderProps = {
  vals: any;
  ctx: CanvasRenderingContext2D;
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
