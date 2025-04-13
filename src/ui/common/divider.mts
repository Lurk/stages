export type DividerArgs = {
  container: HTMLElement;
};

export function divider({ container }: DividerArgs) {
  const div = document.createElement("div");
  div.classList.add("divider");
  container.appendChild(div);
}
