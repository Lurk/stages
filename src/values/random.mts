import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { getOneNumber } from "../value.mjs";

export type RandomArgs = {
  name: string;
  min?: string | number;
  max?: string | number;
  rate?: string | number;
};

export function random({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<RandomArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    type: "random",
    onRemove: () => {
      state.values.unregister(args.name);
      onRemove();
      removeMin();
      removeMax();
      removeRate();
    },
  });

  let componentState = { ...args };

  const {
    value: min,
    update: updateMin,
    onRemove: removeMin,
    state: stateMin,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_min`,
    label: "min",
    onChange(min) {
      componentState = { ...componentState, min };
      onChange(componentState);
    },
  });
  const {
    value: max,
    update: updateMax,
    onRemove: removeMax,
    state: stateMax,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_max`,
    label: "max",
    onChange(max) {
      componentState = { ...componentState, max };
      onChange(componentState);
    },
  });

  const {
    value: rate,
    update: updateRate,
    onRemove: removeRate,
    state: stateRate,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_rate`,
    label: "rate",
    value: args.rate,
    onChange(rate) {
      componentState = { ...componentState, rate };
      onChange(componentState);
    },
  });

  let lastTime: (number | undefined)[] = [];
  let lastValue: (number | undefined)[] = [];

  state.values.register(args.name, (now, i) => {
    if (
      lastValue[i] === undefined ||
      now - (lastTime[i] || 0) > getOneNumber(rate(now, i))
    ) {
      const val =
        Math.random() *
          (getOneNumber(max(now, i)) - getOneNumber(min(now, i))) +
        getOneNumber(min(now, i));
      showValue(val.toPrecision(6));
      lastValue[i] = val;
      lastTime[i] = now;
    }
    return [lastValue[i]];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateMin(args.min);
    updateMax(args.max);
    updateRate(args.rate);

    componentState = {
      name: args.name,
      min: stateMin(),
      max: stateMax(),
      rate: stateRate(),
    };

    onChange(componentState);
  }, 1);
}

export const randomSerde: ComponentSerde<RandomArgs> = () => {
  const keys = ["name", "min", "max", "rate"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(vevrison, val, start) {
      let local_start = start;
      const res: RandomArgs = {
        name: "",
        min: 0,
        max: 0,
        rate: 25,
      };
      keys.forEach((key) => {
        if (key === "rate" && vevrison < 2) {
          return;
        }
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
