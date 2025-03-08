import { Controls } from "./controls.mjs";
import { connect, Value } from "./value.mjs";
import { renderControl } from "./utils.mjs";

type Output = { y: Value; x: Value; sr: Value; vertices: Value };
export type AddOutputArgs = {
  name: string;
  x?: string;
  y?: string;
  sr?: string;
  vertices?: string;
};

type Outputs = {
  outputs: Map<number, Output>;
  add: (args: AddOutputArgs) => void;
};

export function initOutputs(ctrl: Controls): Outputs {
  const outputs: Map<number, Output> = new Map();

  return {
    outputs,
    add(args: AddOutputArgs) {
      const id = outputs.size;
      const { container } = renderControl(args.name, () => {
        outputs.delete(id);
      });

      const { value: x } = connect(ctrl, "", {
        container,
        id: `${args.name}_x_input`,
        selected: args.x,
        label: "x",
      });
      const { value: y } = connect(ctrl, "", {
        container,
        id: `${args.name}_y_input`,
        selected: args.y,
        label: "y",
      });
      const { value: sr } = connect(ctrl, "", {
        container,
        id: `${args.name}_sr_input`,
        selected: args.sr,
        label: "sr",
      });
      const { value: vertices } = connect(ctrl, "", {
        container,
        id: `${args.name}_dots_input`,
        selected: args.vertices,
        label: "vertices",
      });
      outputs.set(id, {
        x,
        y,
        sr,
        vertices,
      });
    },
  };
}
