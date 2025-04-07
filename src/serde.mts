import { oscillatorSerde } from "./values/oscillator.mjs";
import { lineSerde } from "./outputs/line.mjs";
import { mathSerde } from "./values/math.mjs";
import { randomSerde } from "./values/random.mjs";
import { CreatorConfig } from "./factory.mjs";
import { assert } from "./utils.mjs";
import { logicSerde } from "./values/logic.mjs";
import { sliderSerde } from "./values/slider.mjs";
import { mapSerde } from "./values/map.mjs";
import { colorSerde } from "./values/color.mjs";
import { boxSerde } from "./outputs/box.mjs";

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
    case "map":
      return "06";
    case "color":
      return "07";
    case "box":
      return "08";
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
    case "06":
      return "map";
    case "07":
      return "color";
    case "08":
      return "box";
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export type ComponentSerde<T> = () => {
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
  const s = sliderSerde();
  const o = oscillatorSerde();
  const l = lineSerde();
  const m = mathSerde();
  const r = randomSerde();
  const lgc = logicSerde();
  const map = mapSerde();
  const c = colorSerde();
  const b = boxSerde();

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
      case "map":
        return `${type}${map.toString(control.args)}`;
      case "color":
        return `${type}${c.toString(control.args)}`;
      case "box":
        return `${type}${b.toString(control.args)}`;
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
            break;
          }
          case "map": {
            const { val, end } = map.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "color": {
            const { val, end } = c.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
          }
          case "box": {
            const { val, end } = b.fromString(str, pos);
            controls.set(val.name, { type, args: val });
            pos = end;
            break;
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
