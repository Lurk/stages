import { Controls, renderMixer } from "../stages.mjs";
import { getOrCreateControl } from "../utils.mjs";

export function mixer(ctrl: Controls, id: string) {
  const mixerContainer = getOrCreateControl(id);

  ctrl.register(
    id,
    renderMixer(ctrl, {
      id: `${id}_mixer`,
      label: "mixer",
      container: mixerContainer,
    }),
  );
}
