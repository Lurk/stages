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
