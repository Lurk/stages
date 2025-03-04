import { Controls } from "../controls.mjs";
import { renderControl } from "../utils.mjs";
import { connect } from "../value.mjs";

export function random(ctrl: Controls, id: string) {
  ctrl.register(id, () => {
    const { container, showValue } = renderControl(id, () =>
      ctrl.unregister(id),
    );

    const min = connect(ctrl, id, {
      id: `${id}_min`,
      label: "min",
      container,
    });
    const max = connect(ctrl, id, {
      id: `${id}_max`,
      label: "max",
      container,
    });

    return (now, i) => {
      const val = Math.random() * (max(now, i) - min(now, i)) + min(now, i);
      showValue(val);
      return val;
    };
  });
}
