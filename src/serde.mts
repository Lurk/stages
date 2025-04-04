import { oscillatorSerde } from "./controls/oscillator.mjs";
import { lineSerde } from "./controls/line.mjs";
import { mathSerde } from "./controls/math.mjs";
import { randomSerde } from "./controls/random.mjs";
import { CreatorConfig } from "./controls/factory.mjs";
import { assert } from "./utils.mjs";
import { logicSerde } from "./controls/logic.mjs";
import { sliderSerde } from "./controls/slider.mjs";

const VERSION = 2;

function typeToString(type: CreatorConfig["type"]): string {
  switch (type) {
    case "slider":
      return "00";
    case "oscillator":
      return "01";
    case "line":
      return "02";
    case "math":
      return "03";
    case "random":
      return "04";
    case "logic":
      return "05";
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

function stringToType(type: string): CreatorConfig["type"] {
  switch (type) {
    case "00":
      return "slider";
    case "01":
      return "oscillator";
    case "02":
      return "line";
    case "03":
      return "math";
    case "04":
      return "random";
    case "05":
      return "logic";
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export type Serializer = (val?: string) => string;

const serialize: Serializer = (val) => {
  return `${val?.length ?? 1}.${val ?? 0}`;
};

export type Deserializer = (
  val: string,
  start: number,
) => { val: string; end: number };

const deserialize: Deserializer = (val, start) => {
  const separator = val.indexOf(".", start);
  const len = parseInt(val.slice(start, separator), 10);

  if (Number.isNaN(len)) {
    throw new Error(`Unable to parse the len from: "${val}"`);
  }

  return {
    val: val.slice(separator + 1, separator + len + 1),
    end: separator + len + 1,
  };
};

export type ComponentSerde<T> = (
  serialze: Serializer,
  deserialize: Deserializer,
) => {
  toString: (args: T) => string;
  fromString: (val: string, start: number) => { val: T; end: number };
};

type State = {
  controls: Map<string, CreatorConfig>;
  areControlsVisible: boolean;
};

export type Serde = {
  fromString: (str: string) => State;
  toString: (controls: State) => string;
};

export function serde(): Serde {
  const s = sliderSerde(serialize, deserialize);
  const o = oscillatorSerde(serialize, deserialize);
  const l = lineSerde(serialize, deserialize);
  const m = mathSerde(serialize, deserialize);
  const r = randomSerde(serialize, deserialize);
  const lgc = logicSerde(serialize, deserialize);

  const controlToString = (control: CreatorConfig): string => {
    const type = typeToString(control.type);
    switch (control.type) {
      case "slider":
        return `${type}${s.toString(control.args)}`;
      case "oscillator":
        return `${type}${o.toString(control.args)}`;
      case "line":
        return `${type}${l.toString(control.args)}`;
      case "math":
        return `${type}${m.toString(control.args)}`;
      case "random":
        return `${type}${r.toString(control.args)}`;
      case "logic":
        return `${type}${lgc.toString(control.args)}`;
    }
  };

  return {
    toString(state: State) {
      const v = VERSION.toString(32).padStart(3, "0");
      const visibility = state.areControlsVisible ? "Y" : "N";
      const controls = [...state.controls.values()]
        .map(controlToString)
        .join("");
      return `${v}${visibility}${controls}`;
    },

    fromString(str) {
      if (str.length === 0) {
        return { controls: new Map(), areControlsVisible: true };
      }
      let pos = 0;
      const version = parseInt(str.slice(pos, pos + 3), 32);
      assert(version <= VERSION, `Version mismatch: ${version} >= ${VERSION}`);

      pos += 3;
      const visible = str[pos];
      assert(
        str[pos] === "Y" || str[pos] === "N",
        `Invalid visibility: ${visible}`,
      );
      pos += 1;
      const controls: State["controls"] = new Map();
      while (pos < str.length) {
        const type = stringToType(str.slice(pos, pos + 2));
        pos += 2;
        switch (type) {
          case "slider": {
            const { val, end } = s.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "oscillator": {
            const { val, end } = o.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "line": {
            const { val, end } = l.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "math": {
            const { val, end } = m.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "random": {
            const { val, end } = r.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "logic": {
            const { val, end } = lgc.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
          }
        }
      }
      return {
        controls,
        areControlsVisible: visible === "Y",
      };
    },
  };
}
