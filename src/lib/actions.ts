import { get, type Readable } from "svelte/store";

type ClickHandler = Parameters<typeof window.addEventListener<"click">>[1];
export const clickOutside = (
  node: HTMLElement,
  {
    enabled,
    handler,
  }: {
    enabled: boolean;
    handler: (e: Parameters<ClickHandler>[0]) => void;
  }
) => {
  let waiting = true;
  const handleClick: ClickHandler = (e) => {
    console.log("click outside1");
    if (!e.target) return;
    console.log("click outside2");

    if (waiting) {
      waiting = false;
      return;
    }
    if (!node.contains(e.target as Node) && enabled) {
      handler(e);
    }
  };

  const update = ({ enabled }: { enabled: boolean }) => {
    console.log("update", enabled);
    if (enabled) {
      window.addEventListener("click", handleClick);
    } else {
      window.removeEventListener("click", handleClick);
    }
  };
  update({ enabled });
  return {
    destroy() {
      window.removeEventListener("click", handleClick);
    },
    update,
  };
};
