import {
  CONTROL_TYPES,
  controlTypeGuard,
  CreatorConfig,
} from "../../factory.mjs";
import { button } from "../common/button.mjs";
import { renderSelectInputTo } from "../common/select.mjs";
import { renderTextInputTo } from "../common/text_input.mjs";

export type ControlsArgs = {
  add: (args: CreatorConfig) => void;
  container: HTMLDivElement;
};

export function controls({ container, add }: ControlsArgs) {
  const nameInput = renderTextInputTo({
    label: "name:",
    container,
  });

  const {
    select: { el: controlTypeSelect },
  } = renderSelectInputTo({
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
      add({ type, args: { name } });
      nameInput.value = "";
    },
  });
}
