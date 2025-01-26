export function assert(lhs: any, message: string): asserts lhs {
  if (!lhs) {
    throw new Error(message);
  }
}

export type RenderInputArgs = {
  id: string;
  min: number;
  max: number;
  value: number;
};

export function renderRangeTo(
  id: string,
  args: RenderInputArgs,
): HTMLInputElement {
  const root = document.getElementById(id);
  assert(root, `root element id=${id} not found`);

  let label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.id;

  let el = document.createElement("input");
  el.min = String(args.min);
  el.max = String(args.max);
  el.value = String(args.value);
  el.type = "range";
  el.id = args.id;

  root.appendChild(label);
  root.appendChild(el);

  return el;
}
