import { Value } from "../value.mjs";
import { connect } from "../values/connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { assert, ComponentArgs, deserialize, serialize } from "../utils.mjs";

export type Line = {
  y: Value;
  x: Value;
  sr: Value;
  vertices: Value;
  color: Value;
};

export type AddLineArgs = {
  name: string;
  x?: string | number;
  y?: string | number;
  color?: string;
  sr?: string | number;
  vertices?: string | number;
};

type Args = ComponentArgs<AddLineArgs>;

export function line({ state, args, onRemove, onChange }: Args) {
  const container = renderContainer({
    id: args.name,
    type: "line",
    isOutput: true,
  });

  container.onRemove(() => {
    state.outputs.delete(args.name);
    onRemove();
  });

  let componentState: Readonly<AddLineArgs> = { ...args };

  const x = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_x_input`,
    value: args.x,
    label: "x",
    onChange(x) {
      componentState = { ...componentState, x };
      onChange(componentState);
    },
  });
  const y = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_y_input`,
    value: args.y,
    label: "y",
    onChange(y) {
      componentState = { ...componentState, y };
      onChange(componentState);
    },
  });

  const color = connect({
    connectable: state.colors,
    omit: "",
    container,
    id: `${args.name}_color_input`,
    value: args.color,
    label: "color",
    hasNumberInput: false,
    onChange(color) {
      assert(typeof color === "string", "color can be only connected");
      componentState = { ...componentState, color };
      onChange(componentState);
    },
  });

  const sr = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_sr_input`,
    value: args.sr,
    label: "sr",
    onChange(sr) {
      componentState = { ...componentState, sr };
      onChange(componentState);
    },
  });
  const vertices = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_vertices_input`,
    value: args.vertices,
    label: "vertices",
    onChange(vertices) {
      componentState = { ...componentState, vertices };
      onChange(componentState);
    },
  });

  state.outputs.set(args.name, {
    kind: "line",
    value: {
      x,
      y,
      sr,
      vertices,
      color,
    },
  });
}

export const lineSerde: ComponentSerde<AddLineArgs> = () => {
  const keys = ["name", "x", "y", "sr", "vertices", "color"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(version, val, start) {
      let local_start = start;
      const res: AddLineArgs = {
        name: "",
        x: 0,
        y: 0,
        sr: 0,
        vertices: 0,
        color: "",
      };

      keys.forEach((key) => {
        if (key === "color" && version < 2) {
          // color is not serialized, so we skip it
          return;
        }
        const { val: v, end } = deserialize(val, local_start);
        if ((key === "name" || key === "color") && typeof v === "string") {
          res[key] = v;
        } else if (key !== "name" && key !== "color") {
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
