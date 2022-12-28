<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CharaChorderHalf from "./CharaChorderHalf.svelte";

  import type { DefaultLayer, JoystickInput, Layout, Stick } from "./schema/v1";

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
</script>

{#if layoutLayer}
  <div class="chara">
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
    display: flex;
    justify-content: center;

    gap: 1rem;
  }
</style>
