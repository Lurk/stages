import {
  CONTROL_TYPES,
  controlTypeGuard,
  CreatorConfig,
  Updater,
} from "../controls.mjs";
import {
  renderControl,
  renderSelectInputTo,
  renderTextInputTo,
} from "../utils.mjs";

type RenderProps = {
  vals: any;
  addControl: (args: CreatorConfig) => Updater;
  animate: () => void;
};

export function render(props: RenderProps) {
  const { container } = renderControl("control");

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

  const createButton = document.createElement("button");
  createButton.textContent = "Create Control";
  container.appendChild(createButton);
  createButton.addEventListener("click", () => {
    const type = controlTypeSelect.value;
    const name = nameInput.value.trim();

    if (!controlTypeGuard(type)) {
      alert("Invalid control type");
      return;
    }
    props.addControl({ type, args: { name } });
    nameInput.value = "";
  });

  const runButton = document.createElement("button");
  runButton.textContent = "Run";
  container.appendChild(runButton);
  runButton.addEventListener("click", props.animate);
}
