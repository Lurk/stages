import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { assert, ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { Value } from "../value.mjs";
import { connect } from "../values/connect.mjs";

export type Box = {
  x: Value;
  y: Value;
  width: Value;
  height: Value;
  color: Value;
  amount: Value;
  sr: Value;
};

export type AddBoxArgs = {
  name: string;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  color?: string;
  amount?: string | number;
  sr?: string | number;
};

type Args = ComponentArgs<AddBoxArgs>;

export function box({ state, args, onRemove, onChange }: Args) {
  const { container } = renderContainer({
    id: args.name,
    type: "box",
    isOutput: true,
    onRemove: () => {
      state.outputs.delete(args.name);
      onRemove();
      removeX();
      removeY();
      removeWidth();
      removeHeight();
      removeColor();
      removeAmount();
      removeSr();
    },
  });

  let componentState = { ...args };

  const {
    value: x,
    update: updateX,
    onRemove: removeX,
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
    onRemove: removeY,
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
    value: width,
    update: updateWidth,
    onRemove: removeWidth,
    state: stateWidth,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_width_input`,
    value: args.width,
    label: "width",
    onChange(width) {
      componentState = { ...componentState, width };
      onChange({ ...componentState });
    },
  });

  const {
    value: height,
    update: updateHeight,
    onRemove: removeHeight,
    state: stateHeight,
  } = connect({
    connectable: state.values,
    omit: "",
    container,
    id: `${args.name}_height_input`,
    value: args.height,
    label: "height",
    onChange(height) {
      componentState = { ...componentState, height };
      onChange({ ...componentState });
    },
  });

  const {
    value: color,
    update: updateColor,
    onRemove: removeColor,
    state: stateColor,
  } = connect({
    connectable: state.colors,
    omit: "",
    container,
    id: `${args.name}_color_input`,
    value: args.color,
    label: "color",
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
    onRemove: removeAmount,
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
    onRemove: removeSr,
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
    kind: "box",
    value: {
      x,
      y,
      width,
      height,
      color,
      sr,
      amount,
    },
  });

  setTimeout(() => {
    updateX(args.x);
    updateY(args.y);
    updateWidth(args.width);
    updateHeight(args.height);
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
      width: stateWidth(),
      height: stateHeight(),
      color,
      amount: stateAmount(),
      sr: stateSr(),
    };

    onChange({ ...componentState });
  });
}

export const boxSerde: ComponentSerde<AddBoxArgs> = () => {
  const keys = [
    "name",
    "x",
    "y",
    "width",
    "height",
    "amount",
    "sr",
    "color",
  ] as const;

  return {
    toString(args) {
      return keys.map((k) => serialize(args[k])).join("");
    },
    fromString(v, val, start) {
      let local_start = start;
      const res: AddBoxArgs = {
        name: "",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        amount: 0,
        sr: 0,
        color: "",
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

      return { val: res, end: local_start };
    },
  };
};
