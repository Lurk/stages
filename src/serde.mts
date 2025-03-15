import { SliderArgs } from "./controls/slider.mjs";
import { OscillatorArgs } from "./controls/oscillator.mjs";
import { AddOutputArgs } from "./controls/line.mjs";
import { MathArgs } from "./controls/math.mjs";
import { RandomArgs } from "./controls/random.mjs";
import { CreatorConfig } from "./controls/factory.mjs";
import { assert } from "./utils.mjs";

const VERSION = "001";

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

function serialize(val?: string): string {
  return `${val?.length ?? 1}|${val ?? 0}`;
}

function deserialize(val: string, start: number): { val: string; end: number } {
  const separator = val.indexOf("|", start);
  const len = parseInt(val.slice(start, separator), 10);

  if (Number.isNaN(len)) {
    throw new Error(`Unable to parse the len from: "${val}"`);
  }

  return {
    val: val.slice(separator + 1, separator + len + 1),
    end: separator + len + 1,
  };
}

function slider() {
  const keys = ["name", "min", "value", "max"] as const;
  return {
    toString(args: SliderArgs): string {
      return keys
        .map((key) =>
          typeof args[key] === "string"
            ? serialize(args[key])
            : serialize(args[key]?.toString()),
        )

        .join("");
    },

    fromString(val: string, start: number): { val: SliderArgs; end: number } {
      let local_start = start;
      const res: SliderArgs = {
        name: "",
        min: 0,
        value: 0,
        max: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        if (key === "name") {
          res[key] = v;
        } else {
          res[key] = parseFloat(v);
        }
      });
      return { val: res, end: local_start };
    },
  };
}

function oscillator() {
  const keys = ["name", "min", "max", "raise", "fall"] as const;
  return {
    toString(args: OscillatorArgs): string {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(
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
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
}

function line() {
  const keys = ["name", "x", "y", "sr", "vertices"] as const;
  return {
    toString(args: AddOutputArgs): string {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(
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
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
}

function math() {
  const keys = [
    "name",
    "mode_a",
    "lhs1",
    "rhs1",
    "mode_b",
    "lhs2",
    "rhs2",
  ] as const;
  return {
    toString(args: MathArgs): string {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val: string, start: number): { val: MathArgs; end: number } {
      let local_start = start;
      const res: MathArgs = {
        name: "",
        mode_a: "",
        lhs1: "",
        rhs1: "",
        mode_b: "",
        lhs2: "",
        rhs2: "",
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
}

function random() {
  const keys = ["name", "min", "max"] as const;
  return {
    toString(args: RandomArgs): string {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val: string, start: number): { val: RandomArgs; end: number } {
      let local_start = start;
      const res: RandomArgs = {
        name: "",
        min: "",
        max: "",
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
}

type State = {
  controls: Map<string, CreatorConfig>;
  areControlsVisible: boolean;
};

export type Serde = {
  fromString: (str: string) => State;
  toString: (controls: State) => string;
};

export function serde(): Serde {
  const s = slider();
  const o = oscillator();
  const l = line();
  const m = math();
  const r = random();

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
    }
  };

  return {
    toString(state: State) {
      return `${VERSION}${state.areControlsVisible ? "Y" : "N"}${[...state.controls.values()].map(controlToString).join("")}`;
    },

    fromString(str) {
      if (str.length === 0) {
        return { controls: new Map(), areControlsVisible: true };
      }
      let pos = 0;
      const version = str.slice(pos, pos + 3);
      pos += 3;
      assert(
        version === VERSION,
        `Version mismatch: ${version} !== ${VERSION}`,
      );
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
        }
      }
      return {
        controls,
        areControlsVisible: visible === "Y",
      };
    },
  };
}
