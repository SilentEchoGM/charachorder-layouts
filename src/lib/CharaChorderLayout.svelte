<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CharaChorderHalf from "./CharaChorderHalf.svelte";

  import type { DefaultLayer, JoystickInput, Layout, Stick } from "./schema/v2";
  import { useViewportSize } from "@svelteuidev/composables";

  export let layoutLayer: Layout[DefaultLayer];
  export let label = "";

  const viewport = useViewportSize();

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
</script>

{#if layoutLayer}
  <div
    class="chara"
    style:flex-wrap={$viewport.width > 1060 ? "nowrap" : "wrap"}>
    <CharaChorderHalf
      half={layoutLayer.left}
      on:edit-input={handleEditInput("left")}
      {label} />
    <CharaChorderHalf
      right
      half={layoutLayer.right}
      on:edit-input={handleEditInput("right")}
      {label} />
  </div>
{/if}

<style>
  .chara {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 10px;
    margin-top: 2em;
    max-width: 1051px;
    height: max-content;
  }
</style>
