import { renderControl } from "../utils.mjs";
import { Values } from "../value.mjs";
import { connect } from "./connect.mjs";
import { Updater } from "./controlCreator.mjs";

export type RandomArgs = {
  name: string;
  min?: string;
  max?: string;
};

export function random(values: Values, args: RandomArgs): Updater {
  const { container, showValue } = renderControl(args.name, () =>
    values.unregister(args.name),
  );

  const { value: min, update: updateMin } = connect(values, args.name, {
    id: `${args.name}_min`,
    label: "min",
    container,
  });
  const { value: max, update: updateMax } = connect(values, args.name, {
    id: `${args.name}_max`,
    label: "max",
    container,
  });

  values.register(args.name, (now, i) => {
    const val = Math.random() * (max(now, i) - min(now, i)) + min(now, i);
    showValue(val);
    return val;
  });

  return (container) => {
    if (container.type !== "random") {
      throw new Error("Invalid container type");
    }

    if (container.args.name !== args.name) {
      throw new Error("Invalid container name");
    }

    updateMin(container.args.min);
    updateMax(container.args.max);
  };
}
