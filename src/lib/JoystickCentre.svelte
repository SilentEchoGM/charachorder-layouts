<script lang="ts">
  import { fit, parent_style } from "@leveluptuts/svelte-fit";
  import { createEventDispatcher } from "svelte";
  import { mousePosition } from "./mousePos";

  export let text = "Q";

  const emit = createEventDispatcher();

  const accessibleEdit = ({ key }: KeyboardEvent) => {
    if (key === "q" && mousePosition.check(container)) emit("edit-input");
  };

  let container: HTMLDivElement;
</script>

<div
  bind:this={container}
  class="container"
  on:click={() => {
    emit("edit-input");
  }}
  on:keydown={accessibleEdit}>
  <div style={parent_style}>
    <div
      class="autosize"
      use:fit={{
        min_size: 5,
        max_size: 40,
      }}>
      <div class="text">
        {text.toLocaleUpperCase()}
      </div>
    </div>
  </div>
</div>

<style>
  div.container {
    position: relative;
    width: 100%;
    height: 100%;
    color: white;
    border-radius: 50%;
    background-color: black;
    border: 4px solid #555;
    flex-shrink: 0;
  }

  .autosize {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
