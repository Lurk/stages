import { State } from "./state.mjs";

export function assert(lhs: any, message: string): asserts lhs {
  if (!lhs) {
    alert(message);
    throw new Error(message);
  }
}

export function limiter(
  limit: number,
  cb: (val: string) => void,
): (val: string) => void {
  let lastVal = "";
  let lastTime = Date.now();
  return (val) => {
    if (lastVal !== val && Date.now() - lastTime > limit) {
      cb(val);
      lastVal = val;
      lastTime = Date.now();
    }
  };
}

export function toISOTime(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString();
}

export type Serializer = (val?: string | number) => string;

export const serialize: Serializer = (val) => {
  if (typeof val === "number") {
    return `N${val.toString().length ?? 1}.${val}`;
  } else if (typeof val === "string") {
    return `S${val.length}.${val}`;
  } else if (val === undefined) {
    return `N1.0`;
  } else {
    throw new Error(`Unknown type: ${typeof val}`);
  }
};

export type Deserializer = (
  val: string,
  start: number,
) => { val: string | number; end: number };

function parseLength(val: string, start: number): [number, number] {
  const separator = val.indexOf(".", start);
  assert(
    separator !== -1,
    `Unable to find the separator in: "${val}"\nstart: ${start}`,
  );
  const len = parseInt(val.slice(start, separator), 10);
  assert(
    !Number.isNaN(len),
    `Unable to parse the len from: "${val.slice(start, separator)}"\nstart: ${start}\nseparator: ${separator}\nval: ${val}`,
  );
  return [separator + 1, separator + len + 1];
}

export const deserialize: Deserializer = (val, start) => {
  if (val[start] === "N") {
    const [s, e] = parseLength(val, start + 1);
    const num = parseFloat(val.slice(s, e));

    assert(!Number.isNaN(num), `Unable to parse the number from: "${val}"`);

    return { val: num, end: e };
  } else if (val[start] === "S") {
    const [s, e] = parseLength(val, start + 1);
    return { val: val.slice(s, e), end: e };
  }

  // handle v.001 format
  const [s, e] = parseLength(val, start);
  return { val: val.slice(s, e), end: e };
};

export type ComponentArgs<T> = {
  state: State;
  args: T;
  onRemove: () => void;
  onChange: (args: Readonly<T>) => void;
};
