import { Controls } from "./controls.mjs";
import { connect, Value } from "./value.mjs";
import { renderControl } from "./utils.mjs";

type Output = { y: Value; x: Value; resolution: Value; dots: Value };

type Outputs = {
  outputs: Map<number, Output>;
  add: (name: string) => void;
};

export function initOutputs(ctrl: Controls): Outputs {
  const outputs: Map<number, Output> = new Map();

  return {
    outputs,
    add(name) {
      const id = outputs.size;
      const { container } = renderControl(name, () => {
        outputs.delete(id);
      });

      outputs.set(id, {
        x: connect(ctrl, "", {
          container,
          id: `${name}_x_input`,
          label: "x",
        }),
        y: connect(ctrl, "", {
          container,
          id: `${name}_y_input`,
          label: "y",
        }),
        resolution: connect(ctrl, "", {
          container,
          id: `${name}_sr_input`,
          label: "sr",
        }),
        dots: connect(ctrl, "", {
          container,
          id: `${name}_dots_input`,
          label: "dots",
        }),
      });
    },
  };
}
