import { Value } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderSelectInputTo } from "../ui/common/select.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";

export type LogicArgs = {
  name: string;
  mode?: string;
  lhs?: string | number;
  rhs?: string | number;
  isTrue?: string | number;
  isFalse?: string | number;
};

const options = ["gt", "gte", "lt", "lte", "eq", "neq"] as const;

function evaluate(
  o: string,
  lhs: Value,
  rhs: Value,
  isTrue: Value,
  isFalse: Value,
  now: number,
  i: number,
): number {
  switch (o) {
    case "gt":
      return lhs(now, i) > rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    case "gte":
      return lhs(now, i) >= rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    case "lt":
      return lhs(now, i) < rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    case "lte":
      return lhs(now, i) <= rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    case "eq":
      return lhs(now, i) == rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    case "neq":
      return lhs(now, i) != rhs(now, i) ? isTrue(now, i) : isFalse(now, i);
    default:
      throw new Error(`option: ${o} is not supported`);
  }
}

export function logic({
  values,
  args,
  onRemove,
  onChange,
}: ComponentArgs<LogicArgs>) {
  const { container, showValue } = renderContainer(args.name, false, () => {
    values.unregister(args.name);
    onRemove();
    lhsRemove();
    rhsRemove();
    isFalseRemove();
    isTrueRemove();
  });

  let state = { ...args };

  const {
    select: { el: mode },
  } = renderSelectInputTo({
    id: `${args.name}_mode`,
    label: "mode",
    selected: args.mode,
    options,
    container,
  });

  mode.addEventListener("change", () => {
    state = { ...state, mode: mode.value };
    onChange({ ...state });
  });

  const {
    value: lhs,
    update: lhsUpdate,
    onRemove: lhsRemove,
    state: stateLhs,
  } = connect({
    values,
    omit: `${args.name}_a`,
    container,
    id: `${args.name}_lhs`,
    label: `lhs`,
    value: args.lhs,
    onChange(lhs) {
      state = { ...state, lhs };
      onChange({ ...state, lhs });
    },
  });

  const {
    value: rhs,
    update: rhsUpdate,
    onRemove: rhsRemove,
    state: stateRhs,
  } = connect({
    values,
    omit: `${args.name}`,
    container,
    id: `${args.name}_rhs`,
    label: `rhs`,
    value: args.rhs,
    onChange(rhs) {
      state = { ...state, rhs };
      onChange({ ...state });
    },
  });

  const {
    value: isRrue,
    update: isTrueUpdate,
    onRemove: isTrueRemove,
    state: stateIsTrue,
  } = connect({
    values,
    omit: `${args.name}`,
    container,
    id: `${args.name}_is_true`,
    label: `is_true`,
    value: args.isTrue,
    onChange(is_true) {
      state = { ...state, isTrue: is_true };
      onChange({ ...state });
    },
  });

  const {
    value: isFalse,
    update: isFalseUpdate,
    onRemove: isFalseRemove,
    state: stateIsFalse,
  } = connect({
    values,
    omit: `${args.name}`,
    container,
    id: `${args.name}_is_false`,
    label: `is_false`,
    value: args.isFalse,
    onChange(is_false) {
      state = { ...state, isFalse: is_false };
      onChange({ ...state });
    },
  });

  values.register(`${args.name}`, (now, i) => {
    const val = evaluate(mode.value, lhs, rhs, isRrue, isFalse, now, i);
    showValue(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    lhsUpdate(args.lhs);
    rhsUpdate(args.rhs);
    isTrueUpdate(args.isTrue);
    isFalseUpdate(args.isFalse);

    state = {
      ...state,
      lhs: stateLhs(),
      rhs: stateRhs(),
      isTrue: stateIsTrue(),
      isFalse: stateIsFalse(),
    };

    onChange(state);
  }, 1);
}

export const logicSerde: ComponentSerde<LogicArgs> = () => {
  const keys = ["name", "mode", "lhs", "rhs", "isTrue", "isFalse"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: LogicArgs = {
        name: "",
        mode: "",
        lhs: 0,
        rhs: 0,
        isTrue: 0,
        isFalse: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (typeof v === "string" && (key === "name" || key === "mode")) {
          res[key] = v;
        } else if (key !== "name" && key !== "mode") {
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
