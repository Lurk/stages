import { Controls, wave, connect, EventHandler } from "../stages.mjs";
import { renderControl } from "../utils.mjs";

export function oscillatorWithConnectInput(ctrl: Controls, id: string) {
  const { container, showValue } = renderControl(id);

  const w = wave({
    min: connect(ctrl, id, {
      id: `${id}_min`,
      label: "min",
      container,
    }),
    max: connect(ctrl, id, {
      id: `${id}_max`,
      label: "max",
      container,
    }),
    raise: connect(ctrl, id, {
      id: `${id}_raise`,
      label: "raise",
      container,
    }),
    fall: connect(ctrl, id, {
      id: `${id}_fall`,
      label: "fall",
      container,
    }),
  });

  ctrl.register(id, {
    get(now) {
      const val = w.get(now);
      showValue(val);
      return val;
    },
    subscribe() {},
    cycle() {},
  });
}
