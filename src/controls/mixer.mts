import { Controls, renderMixer } from "../stages.mjs";
import { renderControl } from "../utils.mjs";

export function mixer(ctrl: Controls, id: string) {
  const { container } = renderControl(id);

  ctrl.register(
    id,
    renderMixer(ctrl, {
      id: `${id}_mixer`,
      label: "mixer",
      container,
    }),
  );
}
