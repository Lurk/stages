import { type } from "os";

export function assert(lhs: any, message: string): asserts lhs {
  if (!lhs) {
    throw new Error(message);
  }
}

export type RenderRangeArgs = {
  id: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
};

export function renderRangeTo(
  id: string,
  args: RenderRangeArgs,
): HTMLInputElement {
  const min = args.min ?? 1;
  const step = args.step ?? 1;
  const max = args.max ?? 100;

  const root = document.getElementById(id);
  assert(root, `root element id=${id} not found`);
  const container = document.createElement("div");
  container.classList.add("slider");

  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.id;

  const el = document.createElement("input");
  el.min = String(min);
  el.max = String(max);
  el.value = String(args.value ?? min);
  el.type = "range";
  el.step = String(step);
  el.id = args.id;

  container.appendChild(label);
  container.appendChild(el);
  root.appendChild(container);

  return el;
}

export type RenderTextInputArgs = {
  value?: string;
  label: string;
};

export function renderTextInputTo(
  id: string,
  args: RenderTextInputArgs,
): HTMLInputElement {
  const root = document.getElementById(id);
  assert(root, `root element id=${id} not found`);
  const container = document.createElement("div");
  const label = document.createElement("label");
  label.htmlFor = args.label;
  label.innerHTML = args.label;

  const el = document.createElement("input");
  el.value = String(args.value ?? "");
  el.type = "text";
  el.id = args.label;

  container.appendChild(label);
  container.appendChild(el);
  root.appendChild(container);

  return el;
}
