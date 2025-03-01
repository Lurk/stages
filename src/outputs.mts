import { Controls } from "./controls.mjs";
import { connect, Stage } from "./stages.mjs";
import { renderControl } from "./utils.mjs";

type Output = { y: Stage; x: Stage; resolution: Stage };

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
          id: `${name}_resolution_input`,
          label: "res",
        }),
      });
    },
  };
}
