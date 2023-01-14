<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CharaChorderHalf from "./CharaChorderHalf.svelte";

  import type { DefaultLayer, JoystickInput, Layout, Stick } from "./schema/v2";

  export let layoutLayer: Layout[DefaultLayer];

  const emit = createEventDispatcher();

  const handleEditInput =
    (half: "left" | "right") =>
    ({ detail }: CustomEvent<{ input: JoystickInput; stick: Stick }>) => {
      emit("edit-input", {
        stick: detail.stick,
        input: detail.input,
        half,
      });
    };

  let container: HTMLDivElement;
  let child: HTMLDivElement;

  const handleResize = (node: HTMLElement) => {
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
</script>

{#if layoutLayer}
  <div class="chara" use:handleResize>
    <CharaChorderHalf
      half={layoutLayer.left}
      on:edit-input={handleEditInput("left")} />
    <CharaChorderHalf
      right
      half={layoutLayer.right}
      on:edit-input={handleEditInput("right")} />
  </div>
{/if}

<style>
  .chara {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2em;
  }
</style>
