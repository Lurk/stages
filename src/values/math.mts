import { Values, Value } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderSelectInputTo } from "../ui/common/select.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { spanWithText } from "../ui/common/span.mjs";
import { deserialize, limiter, serialize } from "../utils.mjs";

export type MathArgs = {
  name: string;
  mode_a?: string;
  lhs1?: string | number;
  rhs1?: string | number;
  mode_b?: string;
  lhs2?: string | number;
  rhs2?: string | number;
};

const options = [
  "sum",
  "sub",
  "mul",
  "pow",
  "div",
  "avg",
  "min",
  "max",
] as const;

function evaluate(
  o: string,
  lhs: Value,
  rhs: Value,
  now: number,
  i: number,
): number {
  switch (o) {
    case "sum":
      return lhs(now, i) + rhs(now, i);
    case "sub":
      return lhs(now, i) - rhs(now, i);
    case "mul":
      return lhs(now, i) * rhs(now, i);
    case "pow":
      return Math.pow(lhs(now, i), rhs(now, i));
    case "div":
      return lhs(now, i) / rhs(now, i);
    case "avg":
      return (lhs(now, i) + rhs(now, i)) / 2;
    case "min":
      return Math.min(lhs(now, i), rhs(now, i));
    case "max":
      return Math.max(lhs(now, i), rhs(now, i));
    default:
      throw new Error(`option: ${o} is not supported`);
  }
}

type Args = {
  values: Values;
  args: MathArgs;
  onRemove: () => void;
  onChange: (args: MathArgs) => void;
};

// http://localhost:3000/stages/?s=002Y00S3.x_tS6.0.0001S7.0.54541S1.101S1.xS4.zeroS5.widthS3.x_tS3.x_t00S7.lfo_minS6.0.7494S7.0.74968S6.0.749900S7.lfo_maxS6.0.7499S4.0.75S4.0.7500S5.lfo_tS1.2S11.40558.98454S6.10000001S3.lfoS7.lfo_minS7.lfo_maxS5.lfo_tS4.zero01S1.yS4.zeroS6.heightS3.lfoS3.lfo02S5.firstS1.xS1.yS3.oneS6.math_b03S4.mathS3.minS5.widthN1.2S3.divS6.math_aN1.2
export function math({ values, args, onRemove, onChange }: Args) {
  const { container, showValue } = renderContainer(args.name, false, () => {
    values.unregister(`${args.name}_a`);
    values.unregister(`${args.name}_b`);
    onRemove();
    lhs1Remove();
    rhs1Remove();
    lhs2Remove();
    rhs2Remove();
  });

  let state = { ...args };

  const {
    select: { el: mode_a },
  } = renderSelectInputTo({
    id: `${args.name}_mode_a`,
    label: "mode",
    selected: args.mode_a,
    options,
    container,
  });

  mode_a.addEventListener("change", () => {
    state = { ...state, mode_a: mode_a.value };
    onChange({ ...state });
  });

  const {
    value: lhs1,
    update: lhs1Update,
    onRemove: lhs1Remove,
    state: stateLhs1,
  } = connect({
    values,
    omit: `${args.name}_a`,
    container,
    id: `${args.name}_lhs1`,
    label: `lhs`,
    value: args.lhs1,
    onChange(lhs1) {
      state = { ...state, lhs1 };
      onChange({ ...state });
    },
  });

  const {
    value: rhs1,
    update: rhs1Update,
    onRemove: rhs1Remove,
    state: stateRhs1,
  } = connect({
    values,
    omit: `${args.name}_a`,
    container,
    id: `${args.name}_rhs1`,
    label: `rhs`,
    value: args.rhs1,
    onChange(rhs1) {
      state = { ...state, rhs1 };
      onChange({ ...state });
    },
  });

  const showValue2 = spanWithText(container, "0");

  const {
    select: { el: mode_b },
  } = renderSelectInputTo({
    id: `${args.name}_mode_b`,
    label: "mode",
    selected: args.mode_b,
    options,
    container,
  });

  mode_b.addEventListener("change", () => {
    state = { ...state, mode_b: mode_b.value };
    onChange({ ...state });
  });

  const {
    value: lhs2,
    update: lhs2Update,
    onRemove: lhs2Remove,
    state: stateLhs2,
  } = connect({
    values,
    omit: `${args.name}_b`,
    container,
    id: `${args.name}_lhs2`,
    label: `lhs`,
    value: args.lhs2,
    onChange(lhs2) {
      state = { ...state, lhs2 };
      onChange({ ...state });
    },
  });

  const {
    value: rhs2,
    update: rhs2Update,
    onRemove: rhs2Remove,
    state: stateRhs2,
  } = connect({
    values,
    omit: `${args.name}_b`,
    container,
    id: `${args.name}_in4`,
    label: `rhs`,
    value: args.rhs2,
    onChange(rhs2) {
      state = { ...state, rhs2 };
      onChange({ ...state });
    },
  });

  values.register(`${args.name}_a`, (now, i) => {
    const val = evaluate(mode_a.value, lhs1, rhs1, now, i);
    showValue(val.toPrecision(6));
    return val;
  });

  const limitedVelueB = limiter(100, (val) => showValue2(val));

  values.register(`${args.name}_b`, (now, i) => {
    const val = evaluate(mode_b.value, lhs2, rhs2, now, i);
    limitedVelueB(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    lhs1Update(args.lhs1);
    rhs1Update(args.rhs1);
    lhs2Update(args.lhs2);
    rhs2Update(args.rhs2);

    state = {
      name: state.name,
      mode_a: mode_a.value,
      lhs1: stateLhs1(),
      rhs1: stateRhs1(),
      mode_b: mode_b.value,
      lhs2: stateLhs2(),
      rhs2: stateRhs2(),
    };

    onChange(state);
  }, 1);
}

export const mathSerde: ComponentSerde<MathArgs> = () => {
  const keys = [
    "name",
    "mode_a",
    "lhs1",
    "rhs1",
    "mode_b",
    "lhs2",
    "rhs2",
  ] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: MathArgs = {
        name: "",
        mode_a: "",
        lhs1: 0,
        rhs1: 0,
        mode_b: "",
        lhs2: 0,
        rhs2: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (
          typeof v === "string" &&
          (key === "name" || key === "mode_a" || key === "mode_b")
        ) {
          res[key] = v;
        } else if (
          key === "lhs1" ||
          key === "rhs1" ||
          key === "lhs2" ||
          key === "rhs2"
        ) {
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
