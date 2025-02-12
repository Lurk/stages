export function assert(lhs: any, message: string): asserts lhs {
  if (!lhs) {
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
  container?: HTMLDivElement;
};

export function renderRangeTo(args: RenderRangeArgs): HTMLInputElement {
  const min = args.min ?? 1;
  const step = args.step ?? 1;
  const max = args.max ?? 100;

  const root = args.container ?? getOrCreateControl("controls");
  const container = document.createElement("div");
  container.classList.add("slider");

  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.label ?? args.id;

  const el = document.createElement("input");
  el.min = String(min);
  el.max = String(max);
  el.value = String(args.value ?? min);
  el.type = "range";
  el.step = String(step);
  el.id = args.id;

  const val = document.createElement("span");
  val.innerHTML = String(args.value ?? min);

  el.onchange = (e) => {
    e.stopPropagation();
    val.innerHTML = el.value;
  };

  container.appendChild(label);
  container.appendChild(el);
  container.appendChild(val);
  root.appendChild(container);

  return el;
}

export type RenderTextInputArgs = {
  value?: string;
  label: string;
  container?: HTMLDivElement;
};

export function renderTextInputTo(args: RenderTextInputArgs): HTMLInputElement {
  const root = args.container ?? getOrCreateControl("controls");
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

export type RenderNumberInputArgs = {
  value?: number;
  label: string;
  container?: HTMLDivElement;
};

export function renderNumberInputTo(
  args: RenderNumberInputArgs,
): HTMLInputElement {
  const root = args.container ?? getOrCreateControl("controls");
  const container = document.createElement("div");
  const label = document.createElement("label");
  label.htmlFor = args.label;
  label.innerHTML = args.label;

  const el = document.createElement("input");
  el.value = String(args.value ?? "0");
  el.type = "number";
  el.id = args.label;

  container.appendChild(label);
  container.appendChild(el);
  root.appendChild(container);

  return el;
}

export type RenderSelectInputArgs = {
  options: string[];
  id: string;
  label?: string;
  container?: HTMLDivElement;
};

export function renderSelectInputTo(args: RenderSelectInputArgs): {
  el: HTMLSelectElement;
  updateOptions: (options: string[]) => void;
  updateValue(val: string): void;
} {
  let value = "0";
  const root = args.container ?? getOrCreateControl("controls");
  const container = document.createElement("div");
  container.classList.add("select");
  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.label ?? args.id;

  const el = document.createElement("select");
  el.id = args.id;
  args.options.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = key;
    option.id = `${el.id}_${key}`;
    el.options.add(option);
  });
  const val = document.createElement("span");
  val.innerHTML = value;

  container.appendChild(label);
  container.appendChild(el);
  container.appendChild(val);
  root.appendChild(container);

  setInterval(() => (val.innerHTML = value), 100);

  let keys = new Set(args.options);

  return {
    el,
    updateValue: (v) => {
      value = v;
    },
    updateOptions: (options) => {
      const newKeys = new Set(options);
      const diff = newKeys.symmetricDifference(keys);
      diff.forEach((key) => {
        if (keys.has(key)) {
          document.getElementById(`${el.id}_key`)?.remove();
        } else {
          const option = document.createElement("option");
          option.value = key;
          option.innerHTML = key;
          option.id = `${el.id}_${key}`;
          el.options.add(option);
        }
      });
      keys = newKeys;
    },
  };
}

export function getOrCreateControl(id: string): HTMLDivElement {
  let control = document.getElementById(id);
  if (!control) {
    const root = document.getElementById("controls");
    assert(root, 'root element id="controls" not found');
    control = document.createElement("div");
    control.classList.add("control");
    root.appendChild(control);
  }
  assert(
    control instanceof HTMLDivElement,
    `HTML element with id="${id}" is not HTMLDivElement`,
  );
  return control;
}
