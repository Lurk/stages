import { Value } from "../value.mjs";
import { connect } from "../values/connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { Outputs } from "../output.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";

export type Line = { y: Value; x: Value; sr: Value; vertices: Value };

export type AddLineArgs = {
  name: string;
  x?: string | number;
  y?: string | number;
  sr?: string | number;
  vertices?: string | number;
};

type Args = ComponentArgs<AddLineArgs> & {
  outputs: Outputs;
};

export function line({ values, outputs, args, onRemove, onChange }: Args) {
  const { container } = renderContainer(args.name, true, () => {
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
    state: stateX,
  } = connect({
    values,
    omit: "",
    container,
    id: `${args.name}_x_input`,
    value: args.x,
    label: "x",
    onChange(x) {
      onChange({ ...Object.assign(state, { x }) });
    },
  });
  const {
    value: y,
    update: updateY,
    onRemove: removeY,
    state: stateY,
  } = connect({
    values,
    omit: "",
    container,
    id: `${args.name}_y_input`,
    value: args.y,
    label: "y",
    onChange(y) {
      onChange({ ...Object.assign(state, { y }) });
    },
  });
  const {
    value: sr,
    update: updateSr,
    onRemove: removeSr,
    state: stateSr,
  } = connect({
    values,
    omit: "",
    container,
    id: `${args.name}_sr_input`,
    value: args.sr,
    label: "sr",
    onChange(sr) {
      onChange({ ...Object.assign(state, { sr }) });
    },
  });
  const {
    value: vertices,
    update: updateVertices,
    onRemove: removeVertices,
    state: stateVertices,
  } = connect({
    values,
    omit: "",
    container,
    id: `${args.name}_vertices_input`,
    value: args.vertices,
    label: "vertices",
    onChange(vertices) {
      onChange({ ...Object.assign(state, { vertices }) });
    },
  });

  outputs.set(args.name, {
    kind: "line",
    value: {
      x,
      y,
      sr,
      vertices,
    },
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateX(args.x);
    updateY(args.y);
    updateSr(args.sr);
    updateVertices(args.vertices);

    Object.assign(state, {
      x: stateX(),
      y: stateY(),
      sr: stateSr(),
      vertices: stateVertices(),
    });
    onChange(state);
  }, 1);
}

export const lineSerde: ComponentSerde<AddLineArgs> = () => {
  const keys = ["name", "x", "y", "sr", "vertices"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: AddLineArgs = {
        name: "",
        x: 0,
        y: 0,
        sr: 0,
        vertices: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (key === "name" && typeof v === "string") {
          res[key] = v;
        } else if (key !== "name") {
          res[key] = v;
        } else {
          throw new Error(`Invalid value for ${key}: ${v}`);
        }
        local_start = end;
      });
      return { val: res, end: local_start };
    },
  };
};
