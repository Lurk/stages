import { Controls } from "./controls.mjs";
import { connect, Value } from "./value.mjs";
import { renderControl } from "./utils.mjs";
import { Updater } from "./controls/controlCreator.mjs";

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
  add: (args: AddOutputArgs) => Updater;
};

export function initOutputs(ctrl: Controls): Outputs {
  const outputs: Map<number, Output> = new Map();

  return {
    outputs,
    add(args) {
      const id = outputs.size;
      const { container } = renderControl(args.name, () => {
        outputs.delete(id);
      });

      const { value: x, update: updateX } = connect(ctrl, "", {
        container,
        id: `${args.name}_x_input`,
        selected: args.x,
        label: "x",
      });
      const { value: y, update: updateY } = connect(ctrl, "", {
        container,
        id: `${args.name}_y_input`,
        selected: args.y,
        label: "y",
      });
      const { value: sr, update: updateSr } = connect(ctrl, "", {
        container,
        id: `${args.name}_sr_input`,
        selected: args.sr,
        label: "sr",
      });
      const { value: vertices, update: updateVertices } = connect(ctrl, "", {
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
      return (container) => {
        if (container.type !== "output") {
          throw new Error("Invalid container type");
        }

        if (container.args.name !== args.name) {
          throw new Error("Invalid container name");
        }

        updateX(container.args.x);
        updateY(container.args.y);
        updateSr(container.args.sr);
        updateVertices(container.args.vertices);
      };
    },
  };
}
