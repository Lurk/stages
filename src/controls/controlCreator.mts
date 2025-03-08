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

const creator = (
  ctrl: Controls,
  addOutput: (args: AddOutputArgs) => void,
  { type, args }: CreatorArgs,
) => {
  if (!args.name) {
    alert("Please enter a name");
    return;
  }

  switch (type) {
    case "slider":
      sliderWithNumericInputs(ctrl, args);
      break;
    case "oscillator":
      oscillatorWithConnectInput(ctrl, args);
      break;
    case "mixer":
      mixer(ctrl, args);
      break;
    case "output":
      addOutput(args);
      break;
    case "random":
      random(ctrl, args);
      break;
  }
};

export type InitControlsArgs = {
  ctrl: Controls;
  addOutput: (args: AddOutputArgs) => void;
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

  controls.forEach((control) => creator(ctrl, addOutput, control));
}
