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

type Args = {
  values: Values;
  outputs: Map<string, Output>;
  onRemove: () => void;
  args: AddOutputArgs;
  onChange: (args: AddOutputArgs) => void;
};

export function line({
  values,
  outputs,
  args,
  onRemove,
  onChange,
}: Args): Updater {
  const { container } = renderControl(args.name, () => {
    outputs.delete(args.name);
    onRemove();
    removeX();
    removeY();
    removeSr();
    removeVertices();
  });

  const state = { ...args };

  const {
    value: x,
    update: updateX,
    onRemove: removeX,
  } = connect({
    values,
    omit: "",
    args: {
      container,
      id: `${args.name}_x_input`,
      selected: args.x,
      label: "x",
    },
    onChange(x) {
      onChange({ ...Object.assign(state, { x }) });
    },
  });
  const {
    value: y,
    update: updateY,
    onRemove: removeY,
  } = connect({
    values,
    omit: "",
    args: {
      container,
      id: `${args.name}_y_input`,
      selected: args.y,
      label: "y",
    },
    onChange(y) {
      onChange({ ...Object.assign(state, { y }) });
    },
  });
  const {
    value: sr,
    update: updateSr,
    onRemove: removeSr,
  } = connect({
    values,
    omit: "",
    args: {
      container,
      id: `${args.name}_sr_input`,
      selected: args.sr,
      label: "sr",
    },
    onChange(sr) {
      onChange({ ...Object.assign(state, { sr }) });
    },
  });
  const {
    value: vertices,
    update: updateVertices,
    onRemove: removeVertices,
  } = connect({
    values,
    omit: "",
    args: {
      container,
      id: `${args.name}_vertices_input`,
      selected: args.vertices,
      label: "vertices",
    },
    onChange(vertices) {
      onChange({ ...Object.assign(state, { vertices }) });
    },
  });

  outputs.set(args.name, {
    x,
    y,
    sr,
    vertices,
  });

  return (container) => {
    if (container.type !== "line") {
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
}
