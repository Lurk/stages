import { CreatorArgs } from "./controls/controlCreator.mjs";
import { SliderArgs } from "./controls/slider.mjs";
import { OscillatorArgs } from "./controls/oscillator.mjs";
import { AddOutputArgs } from "./outputs.mjs";
import { MixerArgs } from "./controls/mixer.mjs";
import { RandomArgs } from "./controls/random.mjs";

const VERSION = 1;

function typeToString(type: CreatorArgs["type"]): string {
  switch (type) {
    case "slider":
      return "00";
    case "oscillator":
      return "01";
    case "output":
      return "02";
    case "mixer":
      return "03";
    case "random":
      return "04";
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

function stringToType(type: string): CreatorArgs["type"] {
  switch (type) {
    case "00":
      return "slider";
    case "01":
      return "oscillator";
    case "02":
      return "output";
    case "03":
      return "mixer";
    case "04":
      return "random";
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

function ser(val?: string): string {
  return `${val?.length ?? 1}:${val ?? 0}`;
}

function de(val: string, start: number): { val: string; end: number } {
  const separator = val.indexOf(":", start);
  const len = parseInt(val.slice(start, separator), 10);

  if (Number.isNaN(len)) {
    throw new Error(`Unable to parse the len from: "${val}"`);
  }

  return {
    val: val.slice(separator + 1, separator + len + 1),
    end: separator + len + 1,
  };
}

function sliderToString(args: SliderArgs): string {
  return `${ser(args.name)}${ser(args.min?.toString())}${ser(args.value?.toString())}${ser(args.max?.toString())}`;
}

function stringToSlider(
  val: string,
  start: number,
): { val: SliderArgs; end: number } {
  let local_start = start;
  const res: SliderArgs = {
    name: "",
    min: 0,
    value: 0,
    max: 0,
  };
  const keys = ["name", "min", "value", "max"] as const;
  keys.forEach((key) => {
    const { val: v, end } = de(val, local_start);
    local_start = end;
    if (key === "name") {
      res[key] = v;
    } else {
      res[key] = parseFloat(v);
    }
  });
  return { val: res, end: local_start };
}

function oscillatorToString(args: OscillatorArgs): string {
  return `${ser(args.name)}${ser(args.min)}${ser(args.max)}${ser(args.raise)}${ser(args.fall)}`;
}

function stringToOscillator(
  val: string,
  start: number,
): { val: OscillatorArgs; end: number } {
  let local_start = start;
  const res: OscillatorArgs = {
    name: "",
    min: "",
    max: "",
    raise: "",
    fall: "",
  };
  const keys = ["name", "min", "max", "raise", "fall"] as const;
  keys.forEach((key) => {
    const { val: v, end } = de(val, local_start);
    local_start = end;
    res[key] = v;
  });
  return { val: res, end: local_start };
}

function outputToString(args: AddOutputArgs): string {
  return `${ser(args.name)}${ser(args.x)}${ser(args.y)}${ser(args.sr)}${ser(args.vertices)}`;
}

function stringToOutput(
  val: string,
  start: number,
): { val: AddOutputArgs; end: number } {
  let local_start = start;
  const res: AddOutputArgs = {
    name: "",
    x: "",
    y: "",
    sr: "",
    vertices: "",
  };
  const keys = ["name", "x", "y", "sr", "vertices"] as const;
  keys.forEach((key) => {
    const { val: v, end } = de(val, local_start);
    local_start = end;
    res[key] = v;
  });
  return { val: res, end: local_start };
}

function mixerToString(args: MixerArgs): string {
  return `${ser(args.name)}${ser(args.mode1)}${ser(args.lhs1)}${ser(args.rhs1)}${ser(args.mode2)}${ser(args.lhs2)}${ser(args.rhs2)}`;
}

function stringToMixer(
  val: string,
  start: number,
): { val: MixerArgs; end: number } {
  let local_start = start;
  const res: MixerArgs = {
    name: "",
    mode1: "",
    lhs1: "",
    rhs1: "",
    mode2: "",
    lhs2: "",
    rhs2: "",
  };
  const keys = [
    "name",
    "mode1",
    "lhs1",
    "rhs1",
    "mode2",
    "lhs2",
    "rhs2",
  ] as const;
  keys.forEach((key) => {
    const { val: v, end } = de(val, local_start);
    local_start = end;
    res[key] = v;
  });
  return { val: res, end: local_start };
}

function randomToString(args: RandomArgs): string {
  return `${ser(args.name)}${ser(args.min)}${args.max}`;
}

function stringToRandom(
  val: string,
  start: number,
): { val: RandomArgs; end: number } {
  let local_start = start;
  const res: RandomArgs = {
    name: "",
    min: "",
    max: "",
  };
  const keys = ["name", "min", "max"] as const;
  keys.forEach((key) => {
    const { val: v, end } = de(val, local_start);
    local_start = end;
    res[key] = v;
  });
  return { val: res, end: local_start };
}

function controlToString(control: CreatorArgs): string {
  const type = typeToString(control.type);
  switch (control.type) {
    case "slider":
      return `${type}${sliderToString(control.args)}`;
    case "oscillator":
      return `${type}${oscillatorToString(control.args)}`;
    case "output":
      return `${type}${outputToString(control.args)}`;
    case "mixer":
      return `${type}${mixerToString(control.args)}`;
    case "random":
      return `${type}${randomToString(control.args)}`;
  }
}

export function toString(controls: CreatorArgs[]): string {
  return `${VERSION.toString().padStart(3, "0")}${controls.map(controlToString).join("")}`;
}

export function fromString(str: string): CreatorArgs[] {
  let pos = 0;
  const version = parseInt(str.slice(pos, pos + 3), 10);
  pos += 3;
  if (version !== VERSION) {
    throw new Error(`Version mismatch: ${version} !== ${VERSION}`);
  }
  const res: CreatorArgs[] = [];
  while (pos < str.length) {
    const type = stringToType(str.slice(pos, pos + 2));
    pos += 2;
    switch (type) {
      case "slider": {
        const { val, end } = stringToSlider(str, pos);
        res.push({ type, args: val });
        pos = end;
        break;
      }
      case "oscillator": {
        const { val, end } = stringToOscillator(str, pos);
        res.push({ type, args: val });
        pos = end;
        break;
      }
      case "output": {
        const { val, end } = stringToOutput(str, pos);
        res.push({ type, args: val });
        pos = end;
        break;
      }
      case "mixer": {
        const { val, end } = stringToMixer(str, pos);
        res.push({ type, args: val });
        pos = end;
        break;
      }
      case "random": {
        const { val, end } = stringToRandom(str, pos);
        res.push({ type, args: val });
        pos = end;
        break;
      }
    }
  }
  return res;
}
