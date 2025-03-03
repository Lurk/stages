import { Controls } from "../controls.mjs";
import { connect } from "../value.mjs";
import { renderControl, renderSelectInputTo } from "../utils.mjs";

export function mixer(ctrl: Controls, id: string) {
  ctrl.register(id, () => {
    const { container, showValue } = renderControl(id, () =>
      ctrl.unregister(id),
    );

    const { el: mode } = renderSelectInputTo({
      id: `${id}_mode`,
      label: "mode",
      options: ["sum", "avg"],
      container,
    });

    const input1 = connect(ctrl, id, {
      id: `${id}_in1`,
      label: `1`,
      container,
    });

    const input2 = connect(ctrl, id, {
      id: `${id}_in2`,
      label: `2`,
      container,
    });

    const input3 = connect(ctrl, id, {
      id: `${id}_in3`,
      label: `3`,
      container,
    });

    const input4 = connect(ctrl, id, {
      id: `${id}_in4`,
      label: `4`,
      container,
    });

    const input5 = connect(ctrl, id, {
      id: `${id}_in5`,
      label: `5`,
      container,
    });

    const sum = (now: number, i: number) =>
      (input1(now, i) || 0) +
      (input2(now, i) || 0) +
      (input3(now, i) || 0) +
      (input4(now, i) || 0) +
      (input5(now, i) || 0);

    return (now, i) => {
      const m = mode.value;
      let val = sum(now, i);
      if (m === "avg") {
        val /= 5;
      }
      showValue(val);
      return val;
    };
  });
}
