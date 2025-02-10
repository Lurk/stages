import { Controls, sum } from "../stages.mjs";
import { getOrCreateControl } from "../utils.mjs";

export function sumWithConnectInputs(ctrl: Controls, id: string) {
  const sumContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  sumContainer.appendChild(header);
  
  ctrl.register(
    id,
    sum(ctrl, {
      id: `${id}_sum`,
      label: "sum",
      container: sumContainer,
    })
  );
} 