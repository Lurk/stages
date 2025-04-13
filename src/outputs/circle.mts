import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { assert, ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { connect } from "../values/connect.mjs";
import { Value } from "../value.mjs";

export type Circle = {
  x: Value;
  y: Value;
  radius: Value;
  color: Value;
  amount: Value;
  sr: Value;
};

export type CircleArgs = {
  name: string;
  x?: string | number;
  y?: string | number;
  radius?: string | number;
  color?: string;
  amount?: string | number;
  sr?: string | number;
};

export function circle({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<CircleArgs>) {
  const container = renderContainer({
    id: args.name,
    type: "circle",
    isOutput: true,
  });

  container.onRemove(() => {
    state.outputs.delete(args.name);
    onRemove();
  });

  let componentState = { ...args };

  const {
    value: x,
    update: updateX,
    state: stateX,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_x_input`,
    value: args.x,
    label: "x",
    onChange(x) {
      componentState = { ...componentState, x };
      onChange({ ...componentState });
    },
  });

  const {
    value: y,
    update: updateY,
    state: stateY,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_y_input`,
    value: args.y,
    label: "y",
    onChange(y) {
      componentState = { ...componentState, y };
      onChange({ ...componentState });
    },
  });

  const {
    value: radius,
    update: updateRadius,
    state: stateRadius,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_radius_input`,
    value: args.radius,
    label: "radius",
    onChange(radius) {
      componentState = { ...componentState, radius };
      onChange({ ...componentState });
    },
  });

  const {
    value: color,
    update: updateColor,
    state: stateColor,
  } = connect({
    connectable: state.colors,
    omit: "",
    container,
    id: `${args.name}_color_input`,
    value: args.color,
    label: "color",
    hasNumberInput: false,
    onChange(color) {
      assert(
        typeof color === "string",
        "color can only be provided by a color component",
      );

      componentState = { ...componentState, color };
      onChange({ ...componentState });
    },
  });

  const {
    value: amount,
    update: updateAmount,
    state: stateAmount,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_amount_input`,
    value: args.amount,
    label: "amount",
    onChange(amount) {
      componentState = { ...componentState, amount };
      onChange({ ...componentState });
    },
  });

  const {
    value: sr,
    update: updateSr,
    state: stateSr,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_sr_input`,
    value: args.sr,
    label: "sr",
    onChange(sr) {
      componentState = { ...componentState, sr };
      onChange({ ...componentState });
    },
  });

  state.outputs.set(args.name, {
    kind: "circle",
    value: {
      x,
      y,
      radius,
      color,
      amount,
      sr,
    },
  });

  setTimeout(() => {
    updateX(args.x);
    updateY(args.y);
    updateRadius(args.radius);
    updateColor(args.color);
    updateAmount(args.amount);
    updateSr(args.sr);

    const color = stateColor();
    assert(
      typeof color === "string",
      "color can only be provided by a color component",
    );

    componentState = {
      name: componentState.name,
      x: stateX(),
      y: stateY(),
      radius: stateRadius(),
      color,
      amount: stateAmount(),
      sr: stateSr(),
    };

    onChange({ ...componentState });
  });
}

export const circleSerde: ComponentSerde<CircleArgs> = () => {
  const keys = ["name", "x", "y", "radius", "color", "amount", "sr"] as const;

  return {
    toString(args: CircleArgs) {
      return keys.map((key) => serialize(args[key])).join("");
    },
    fromString(version, val, start) {
      let local_start = start;
      const res: CircleArgs = {
        name: "",
        x: 0,
        y: 0,
        radius: 0,
        color: "",
        amount: 0,
        sr: 0,
      };
      keys.forEach((key) => {
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

      return {
        val: res,
        end: local_start,
      };
    },
  };
};
