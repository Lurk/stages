import { isAbsolute } from "path";

export function assert(lhs: any, message: string): asserts lhs {
  if (!lhs) {
    alert(message);
    throw new Error(message);
  }
}

export type RenderRangeArgs = {
  id: string;
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  container: HTMLDivElement;
};

export function renderRangeTo(args: RenderRangeArgs): HTMLInputElement {
  const min = args.min ?? 0;
  const step = args.step ?? 0.00001;
  const max = args.max ?? 100;

  const el = document.createElement("input");

  const container = document.createElement("div");
  container.classList.add("slider");

  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerText = args.label ?? args.id;

  el.type = "range";
  el.min = String(min);
  el.max = String(max);
  el.value = String(args.value ?? min);
  el.step = String(step);
  el.id = args.id;

  container.appendChild(label);
  container.appendChild(el);
  args.container.appendChild(container);

  return el;
}

export type RenderTextInputArgs = {
  value?: string;
  label: string;
  container: HTMLDivElement;
};

export function renderTextInputTo(args: RenderTextInputArgs): HTMLInputElement {
  const el = document.createElement("input");
  const container = document.createElement("div");
  container.classList.add("input");
  const label = document.createElement("label");
  label.htmlFor = args.label;
  label.innerText = args.label;

  el.value = String(args.value ?? "");
  el.type = "text";
  el.id = args.label;

  container.appendChild(label);
  container.appendChild(el);

  args.container.appendChild(container);
  return el;
}

export type RenderNumberInputArgs = {
  value?: number;
  id: string;
  label?: string;
  container: HTMLDivElement;
};

export function renderNumberInputTo(
  args: RenderNumberInputArgs,
): HTMLInputElement {
  const root = args.container;
  const container = document.createElement("div");
  container.classList.add("input");
  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerText = args.label ?? args.id;

  const el = document.createElement("input");
  el.value = String(args.value ?? "0");
  el.type = "number";
  el.id = args.id;

  container.appendChild(label);
  container.appendChild(el);
  root.appendChild(container);

  return el;
}

export type RenderSelectInputArgs = {
  options: readonly string[];
  selected?: string;
  id: string;
  label?: string;
  container: HTMLDivElement;
};

export function renderSelectInputTo(args: RenderSelectInputArgs): {
  el: HTMLSelectElement;
  updateOptions: (options: string[]) => void;
} {
  const container = document.createElement("div");
  container.classList.add("input");

  const el = document.createElement("select");
  el.id = args.id + "___aaa___";

  args.options.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.id = `${args.id}_${key}`;
    option.selected = key === args.selected;
    el.options.add(option);
  });

  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.label ?? args.id;

  container.appendChild(label);
  container.appendChild(el);

  args.container.appendChild(container);

  let keys = new Set(args.options);

  return {
    el,
    updateOptions: (options) => {
      const newKeys = new Set(options);
      const diff = newKeys.symmetricDifference(keys);
      diff.forEach((key) => {
        if (keys.has(key)) {
          document.getElementById(`${args.id}_${key}`)?.remove();
        } else {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = key;
          option.id = `${args.id}_${key}`;
          el.options.add(option);
        }
      });
      keys = newKeys;
    },
  };
}

export function renderControl(
  id: string,
  isOutput?: boolean,
  onremove?: () => void,
): {
  container: HTMLDivElement;
  showValue(val: string): void;
} {
  const root = document.getElementById("controls");
  assert(root, 'root element id="controls" not found');
  const container = document.createElement("div");
  const control = document.createElement("div");
  const header = document.createElement("h3");
  const value = spanWithText(container, "");

  if (onremove) {
    const remove = document.createElement("button");
    remove.classList.add("remove");
    remove.innerText = "x";
    remove.onclick = () => {
      onremove();
      control.remove();
    };
    control.appendChild(remove);
  }

  control.classList.add("control");
  if (isOutput) {
    control.classList.add("output");
  }
  container.classList.add("inputs");
  header.innerText = `${id}:`;

  root.appendChild(control);
  control.appendChild(header);
  control.appendChild(container);

  return {
    container,
    showValue: limiter(100, value),
  };
}

export function spanWithText(
  container: HTMLDivElement,
  text: string,
): (text: string) => void {
  const span = document.createElement("span");
  span.innerText = text;
  container.appendChild(span);

  return (text: string) => {
    span.innerText = text;
  };
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
