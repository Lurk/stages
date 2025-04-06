import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import {
  ComponentArgs,
  deserialize,
  getOneNumber,
  serialize,
} from "../utils.mjs";
import { connect } from "./connect.mjs";

export type MapArgs = {
  name: string;
  source?: string | number;
  fromMin?: string | number;
  fromMax?: string | number;
  toMin?: string | number;
  toMax?: string | number;
};

export function map({
  state,
  args,
  onChange,
  onRemove,
}: ComponentArgs<MapArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    type: "mapper",
    onRemove: () => {
      state.values.unregister(`${args.name}`);
      onRemove();
      fromMinRemove();
      fromMaxRemove();
      toMinRemove();
      toMaxRemove();
      sourceRemove();
    },
  });
  showValue("0");

  let componentState = { ...args };

  const {
    value: sourceValue,
    update: sourceUpdate,
    onRemove: sourceRemove,
    state: stateSource,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_source`,
    label: `source`,
    value: args.source,
    onChange(source) {
      componentState = { ...componentState, source };
      onChange({ ...componentState });
    },
  });

  const {
    value: fromMinValue,
    update: fromMinUpdate,
    onRemove: fromMinRemove,
    state: stateFromMin,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_from_min`,
    label: `min`,
    value: args.fromMin,
    onChange(fromMin) {
      componentState = { ...componentState, fromMin };
      onChange({ ...componentState });
    },
  });

  const {
    value: fromMaxValue,
    update: fromMaxUpdate,
    onRemove: fromMaxRemove,
    state: stateFromMax,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_from_max`,
    label: `max`,
    value: args.fromMax,
    onChange(fromMax) {
      componentState = { ...componentState, fromMax };
      onChange({ ...componentState });
    },
  });

  const {
    value: toMinValue,
    update: toMinUpdate,
    onRemove: toMinRemove,
    state: stateToMin,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_to_min`,
    label: `to min`,
    value: args.toMin,
    onChange(toMin) {
      componentState = { ...componentState, toMin };
      onChange({ ...componentState });
    },
  });

  const {
    value: toMaxValue,
    update: toMaxUpdate,
    onRemove: toMaxRemove,
    state: stateToMax,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_to_max`,
    label: `to max`,
    value: args.toMax,
    onChange(toMax) {
      componentState = { ...componentState, toMax };
      onChange({ ...componentState });
    },
  });

  state.values.register(args.name, (now, i) => {
    const fromMin = getOneNumber(fromMinValue(now, i));
    const fromMax = getOneNumber(fromMaxValue(now, i));
    const toMin = getOneNumber(toMinValue(now, i));
    const toMax = getOneNumber(toMaxValue(now, i));
    const source = getOneNumber(sourceValue(now, i));

    const val =
      ((source - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
    showValue(val.toPrecision(6));
    return [val];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    fromMinUpdate(args.fromMin);
    fromMaxUpdate(args.fromMax);
    toMinUpdate(args.toMin);
    toMaxUpdate(args.toMax);
    sourceUpdate(args.source);

    componentState = {
      name: componentState.name,
      source: stateSource(),
      fromMin: stateFromMin(),
      fromMax: stateFromMax(),
      toMin: stateToMin(),
      toMax: stateToMax(),
    };
    onChange(componentState);
  }, 1);
}

export const mapSerde: ComponentSerde<MapArgs> = () => {
  const keys = [
    "name",
    "source",
    "fromMin",
    "fromMax",
    "toMin",
    "toMax",
  ] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: MapArgs = {
        name: "",
        source: 0,
        fromMin: 0,
        fromMax: 0,
        toMin: 0,
        toMax: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (typeof v === "string" && key === "name") {
          res[key] = v;
        } else if (
          key === "source" ||
          key === "fromMin" ||
          key === "fromMax" ||
          key === "toMin" ||
          key === "toMax"
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
