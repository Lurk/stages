export type LabelArgs = {
  id: string;
  container: HTMLElement;
  label?: string;
};

export function label(args: LabelArgs): (label: string) => void {
  const label = document.createElement("label");
  label.htmlFor = args.id;
  label.innerHTML = args.label ?? args.id;
  args.container.appendChild(label);
  return (text: string) => {
    label.innerText = text;
  };
}
