export type DividerArgs = {
  label: string;
  container: HTMLElement;
};

export function divider({ container, label }: DividerArgs) {
  const div = document.createElement("div");
  div.classList.add("divider");
  div.innerText = label;

  container.appendChild(div);

  return (label: string) => {
    div.innerText = label;
  };
}
