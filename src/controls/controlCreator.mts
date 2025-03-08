import { OscillatorArgs, oscillatorWithConnectInput } from "./oscillator.mjs";
import { mixer, MixerArgs } from "./mixer.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./slider.mjs";
import { Controls } from "../controls.mjs";
import {
  renderControl,
  renderSelectInputTo,
  renderTextInputTo,
} from "../utils.mjs";
import { random, RandomArgs } from "./random.mjs";
import { AddOutputArgs } from "../outputs.mjs";

export type CreatorArgs =
  | {
      type: "slider";
      args: SliderArgs;
    }
  | {
      type: "oscillator";
      args: OscillatorArgs;
    }
  | {
      type: "mixer";
      args: MixerArgs;
    }
  | {
      type: "output";
      args: AddOutputArgs;
    }
  | {
      type: "random";
      args: RandomArgs;
    };

export function controlTypeGuard(t: unknown): t is CreatorArgs["type"] {
  return (
    t === "slider" ||
    t === "oscillator" ||
    t === "mixer" ||
    t === "output" ||
    t === "random"
  );
}

export type Updater = (control: CreatorArgs) => void;

const creator = (
  ctrl: Controls,
  addOutput: (args: AddOutputArgs) => Updater,
  { type, args }: CreatorArgs,
): Updater => {
  if (!args.name) {
    alert("Please enter a name");
    throw new Error("Please enter a name");
  }

  switch (type) {
    case "slider":
      return sliderWithNumericInputs(ctrl, args);
    case "oscillator":
      return oscillatorWithConnectInput(ctrl, args);
    case "mixer":
      return mixer(ctrl, args);
    case "output":
      return addOutput(args);
    case "random":
      return random(ctrl, args);
    default:
      throw new Error("Invalid control type");
  }
};

export type InitControlsArgs = {
  ctrl: Controls;
  addOutput: (args: AddOutputArgs) => Updater;
  animate: () => void;
  controls: CreatorArgs[];
};

export function initControls({
  ctrl,
  addOutput,
  animate,
  controls,
}: InitControlsArgs) {
  const { container } = renderControl("control");

  const nameInput = renderTextInputTo({
    label: "name:",
    container,
  });

  const { el: controlTypeSelect } = renderSelectInputTo({
    container,
    options: ["slider", "oscillator", "mixer", "output", "random"],
    id: "control-creation-select",
    label: "type:",
  });

  const createButton = document.createElement("button");
  createButton.textContent = "Create Control";
  container.appendChild(createButton);
  createButton.addEventListener("click", () => {
    const type = controlTypeSelect.value;
    const name = nameInput.value.trim();

    if (!controlTypeGuard(type)) {
      alert("Invalid control type");
      return;
    }
    creator(ctrl, addOutput, { type, args: { name } });
    nameInput.value = "";
  });

  const runButton = document.createElement("button");
  runButton.textContent = "Run";
  container.appendChild(runButton);
  runButton.addEventListener("click", animate);

  const u = controls.map((control) => ({
    updater: creator(ctrl, addOutput, control),
    control,
  }));

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  setTimeout(() => {
    u.forEach(({ updater, control }) => updater(control));
  }, 10);
}
