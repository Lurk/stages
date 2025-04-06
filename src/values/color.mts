import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import {
  ComponentArgs,
  deserialize,
  getOneNumber,
  serialize,
} from "../utils.mjs";
import { connect } from "./connect.mjs";

export type ColorArgs = {
  name: string;
  hue?: string | number;
  saturation?: string | number;
  lightness?: string | number;
  alpha?: string | number;
};

export function color({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<ColorArgs>) {
  const { container } = renderContainer({
    id: args.name,
    type: "color",
    onRemove: () => {
      state.colors.unregister(`${args.name}`);
      onRemove();
      removeHue();
      removeSaturation();
      removeLightness();
      removeAlpha();
    },
  });

  let componentState = { ...args };

  const preview = document.createElement("div");
  preview.classList.add("color-preview");
  preview.style.backgroundColor = `hsl(${args.hue}, ${args.saturation}%, ${args.lightness}%, ${args.alpha})`;
  container.appendChild(preview);

  const {
    value: hue,
    update: updateHue,
    onRemove: removeHue,
    state: stateHue,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_hue`,
    label: "h",
    value: args.hue,
    onChange(hue) {
      componentState = { ...componentState, hue };
      onChange({ ...componentState });
    },
  });

  const {
    value: saturation,
    update: updateSaturation,
    onRemove: removeSaturation,
    state: stateSaturation,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_saturation`,
    label: "s",
    value: args.saturation,
    onChange(saturation) {
      componentState = { ...componentState, saturation };
      onChange({ ...componentState });
    },
  });

  const {
    value: lightness,
    update: updateLightness,
    onRemove: removeLightness,
    state: stateLightness,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_lightness`,
    label: "l",
    value: args.lightness,
    onChange(lightness) {
      componentState = { ...componentState, lightness };
      onChange({ ...componentState });
    },
  });

  const {
    value: alpha,
    update: updateAlpha,
    onRemove: removeAlpha,
    state: stateAlpha,
  } = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_alpha`,
    label: "a",
    value: args.alpha,
    onChange(alpha) {
      componentState = { ...componentState, alpha };
      onChange({ ...componentState });
    },
  });

  state.colors.register(args.name, (now, i) => {
    const hueValue = getOneNumber(hue(now, i)) % 360;
    const saturationValue = getOneNumber(saturation(now, i)) % 100;
    const lightnessValue = getOneNumber(lightness(now, i)) % 100;
    const alphaValue = getOneNumber(alpha(now, i)) % 1;

    preview.style.backgroundColor = `hsl(${hueValue}, ${saturationValue}%, ${lightnessValue}%, ${alphaValue})`;
    return [hueValue, saturationValue, lightnessValue, alphaValue];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    updateHue(args.hue);
    updateSaturation(args.saturation);
    updateLightness(args.lightness);
    updateAlpha(args.alpha);

    componentState = {
      name: componentState.name,
      hue: stateHue(),
      saturation: stateSaturation(),
      lightness: stateLightness(),
      alpha: stateAlpha(),
    };
    onChange(componentState);
  }, 1);
}

export const colorSerde: ComponentSerde<ColorArgs> = () => {
  const keys = ["name", "hue", "saturation", "lightness", "alpha"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: ColorArgs = {
        name: "",
        hue: 0,
        saturation: 0,
        lightness: 0,
        alpha: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (typeof v === "string" && key === "name") {
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
