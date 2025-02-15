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
  container: HTMLDivElement;
};

export function renderRangeTo(args: RenderRangeArgs): HTMLInputElement {
  const min = args.min ?? 1;
  const step = args.step ?? 1;
  const max = args.max ?? 100;

  const el = document.createElement("input");

  const container = document.createElement("div");
  container.classList.add("slider");

  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerText = args.label ?? args.id;

  el.min = String(min);
  el.max = String(max);
  el.value = String(args.value ?? min);
  el.type = "range";
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
  label: string;
  container: HTMLDivElement;
};

export function renderNumberInputTo(
  args: RenderNumberInputArgs,
): HTMLInputElement {
  const root = args.container;
  const container = document.createElement("div");
  const label = document.createElement("label");
  label.htmlFor = args.label;
  label.innerText = args.label;

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
  container: HTMLDivElement;
};

export function renderSelectInputTo(args: RenderSelectInputArgs): {
  el: HTMLSelectElement;
  updateOptions: (options: string[]) => void;
} {
  const el = document.createElement("select");

  const container = document.createElement("div");
  container.classList.add("select");
  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.label ?? args.id;

  el.id = args.id;
  args.options.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.id = `${el.id}_${key}`;
    el.options.add(option);
  });

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
          document.getElementById(`${el.id}_${key}`)?.remove();
        } else {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = key;
          option.id = `${el.id}_${key}`;
          el.options.add(option);
        }
      });
      keys = newKeys;
    },
  };
}

export function renderControl(id: string): {
  container: HTMLDivElement;
  showValue(val: number): void;
} {
  const root = document.getElementById("controls");
  assert(root, 'root element id="controls" not found');
  const container = document.createElement("div");
  const control = document.createElement("div");
  const header = document.createElement("h3");
  let lastVal = 0;
  let lastTime = Date.now();

  control.classList.add("control");
  container.classList.add("inputs");
  header.innerText = `${id}: ${lastVal}`;

  root.appendChild(control);
  control.appendChild(header);
  control.appendChild(container);

  return {
    container,
    showValue: (val) => {
      if (lastVal !== val && Date.now() - lastTime > 100) {
        header.innerText = `${id}: ${val.toPrecision(4)}`;
        lastVal = val;
        lastTime = Date.now();
      }
    },
  };
}
