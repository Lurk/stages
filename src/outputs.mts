import { Controls } from "./controls.mjs";
import { connect, Value } from "./value.mjs";
import { renderControl } from "./utils.mjs";

type Output = { y: Value; x: Value; resolution: Value };

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
        y: connect(ctrl, "", {
          container,
          id: `${name}_y_input`,
          label: "y",
        }),
        x: connect(ctrl, "", {
          container,
          id: `${name}_x_input`,
          label: "x",
        }),
        resolution: connect(ctrl, "", {
          container,
          id: `${name}_sr_input`,
          label: "sr",
        }),
      });
    },
  };
}
