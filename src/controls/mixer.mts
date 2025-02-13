import { Controls, renderMixer } from "../stages.mjs";
import { getOrCreateControl } from "../utils.mjs";

export function mixer(ctrl: Controls, id: string) {
  const mixerContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  mixerContainer.appendChild(header);

  ctrl.register(
    id,
    renderMixer(ctrl, {
      id: `${id}_mixer`,
      label: "mixer",
      container: mixerContainer,
    }),
  );
}
