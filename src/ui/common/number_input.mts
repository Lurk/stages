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
