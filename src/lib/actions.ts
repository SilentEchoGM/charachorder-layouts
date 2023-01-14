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
    console.log("click outside1", e.target);
    if (!e.target) return;
    console.log("click outside2");

    if (waiting) {
      waiting = false;
      return;
    }
    if (!node.contains(e.target as Node) && enabled) {
      console.log(
        "click outside3",
        node,
        e.target,
        node.contains(e.target as Node)
      );
      handler(e);
    } else {
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

export const fitToParent = (node: HTMLElement) => {
  const resize = () => {
    if (!node.parentElement) return;
    const { width: parentWidth, height: parentHeight } =
      node.parentElement.getBoundingClientRect();
    const { width, height } = node.getBoundingClientRect();
    const scale = Math.min(parentWidth / width, parentHeight / height);

    console.log(
      `Parent ${parentWidth}x${parentHeight}`,
      `Child ${width}x${height}`,
      scale
    );

    node.style.transform = `scale(${scale})`;
  };
  resize();
  return {
    update() {
      resize();
    },
  };
};
