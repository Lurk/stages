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

export const deserialize: Deserializer = (val, start) => {
  if (val[start] === "N") {
    const separator = val.indexOf(".", start + 1);
    const len = parseInt(val.slice(start + 1, separator), 10);
    const num = parseFloat(val.slice(separator + 1, separator + len + 1));

    if (Number.isNaN(num)) {
      throw new Error(`Unable to parse the number from: "${val}"`);
    }

    return {
      val: num,
      end: separator + len + 1,
    };
  } else if (val[start] === "S") {
    const separator = val.indexOf(".", start + 1);
    const len = parseInt(val.slice(start + 1, separator), 10);
    const str = val.slice(separator + 1, separator + len + 1);

    if (str.length !== len) {
      throw new Error(`Unable to parse the string from: "${val}"`);
    }

    return {
      val: str,
      end: separator + len + 1,
    };
  }

  // handle v.001 format
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
