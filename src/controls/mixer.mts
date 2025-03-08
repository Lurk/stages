import { Controls } from "../controls.mjs";
import { connect } from "../value.mjs";
import { renderControl, renderSelectInputTo } from "../utils.mjs";
import { Updater } from "./controlCreator.mjs";

export type MixerArgs = {
  name: string;
  input1?: string;
  input2?: string;
  input3?: string;
  input4?: string;
  input5?: string;
};

export function mixer(ctrl: Controls, args: MixerArgs): Updater {
  const { container, showValue } = renderControl(args.name, () =>
    ctrl.unregister(args.name),
  );

  const { el: mode } = renderSelectInputTo({
    id: `${args.name}_mode`,
    label: "mode",
    options: ["sum", "avg"],
    container,
  });

  const { value: input1, update: u1 } = connect(ctrl, args.name, {
    id: `${args.name}_in1`,
    label: `1`,
    container,
    selected: args.input1,
  });

  const { value: input2, update: u2 } = connect(ctrl, args.name, {
    id: `${args.name}_in2`,
    label: `2`,
    container,
    selected: args.input2,
  });

  const { value: input3, update: u3 } = connect(ctrl, args.name, {
    id: `${args.name}_in3`,
    label: `3`,
    container,
    selected: args.input3,
  });

  const { value: input4, update: u4 } = connect(ctrl, args.name, {
    id: `${args.name}_in4`,
    label: `4`,
    container,
    selected: args.input4,
  });

  const { value: input5, update: u5 } = connect(ctrl, args.name, {
    id: `${args.name}_in5`,
    label: `5`,
    container,
    selected: args.input5,
  });

  const sum = (now: number, i: number) =>
    (input1(now, i) || 0) +
    (input2(now, i) || 0) +
    (input3(now, i) || 0) +
    (input4(now, i) || 0) +
    (input5(now, i) || 0);

  ctrl.register(args.name, (now, i) => {
    const m = mode.value;
    let val = sum(now, i);
    if (m === "avg") {
      val /= 5;
    }
    showValue(val);
    return val;
  });

  return (container) => {
    if (container.type !== "mixer") {
      throw new Error("Invalid container type");
    }

    if (container.args.name !== args.name) {
      throw new Error("Invalid container name");
    }

    u1(container.args.input1);
    u2(container.args.input2);
    u3(container.args.input3);
    u4(container.args.input4);
    u5(container.args.input5);
  };
}
