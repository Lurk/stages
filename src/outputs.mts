import { Values, Value } from "./value.mjs";
import { renderControl } from "./utils.mjs";
import { connect } from "./controls/connect.mjs";
import { Updater } from "./controls.mjs";

export type Output = { y: Value; x: Value; sr: Value; vertices: Value };
export type AddOutputArgs = {
  name: string;
  x?: string;
  y?: string;
  sr?: string;
  vertices?: string;
};

type Outputs = {
  outputs: Map<number, Output>;
  add: (args: AddOutputArgs, onRemove: () => void) => Updater;
};

export function initOutputs(values: Values): Outputs {
  const outputs: Map<number, Output> = new Map();

  return {
    outputs,
    add(args, onRemove) {
      const id = outputs.size;
      const { container } = renderControl(args.name, () => {
        outputs.delete(id);
        onRemove();
      });

      const { value: x, update: updateX } = connect(values, "", {
        container,
        id: `${args.name}_x_input`,
        selected: args.x,
        label: "x",
      });
      const { value: y, update: updateY } = connect(values, "", {
        container,
        id: `${args.name}_y_input`,
        selected: args.y,
        label: "y",
      });
      const { value: sr, update: updateSr } = connect(values, "", {
        container,
        id: `${args.name}_sr_input`,
        selected: args.sr,
        label: "sr",
      });
      const { value: vertices, update: updateVertices } = connect(values, "", {
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
