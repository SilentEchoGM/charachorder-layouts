<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import Joystick from "./Joystick.svelte";
  import {
    sticks,
    type Half,
    type JoystickInput,
    type Stick,
  } from "./schema/v2";
  export let label = "";
  export let right = false;
  export let half: Half;

  import { useViewportSize } from "@svelteuidev/composables";

  const viewport = useViewportSize();
  $: ({ width: viewportWidth, height: viewportHeight } = $viewport);

  const emit = createEventDispatcher();

  const handleEditInput =
    (stick: Stick) =>
    ({ detail }: CustomEvent<{ input: JoystickInput }>) => {
      emit("edit-input", {
        stick,
        input: detail.input,
      });
    };

  const handleResize = (
    node: HTMLElement,
    {
      viewportSize,
    }: {
      viewportSize: {
        width: number;
        height: number;
      };
    }
  ): SvelteActionReturnType => {
    const resize = () => {
      if (!node.parentElement) return;

      const { width: parentWidth } = node.parentElement.getBoundingClientRect();

      const scale = parentWidth / 520;

      node.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      node.parentElement.style.height = `${620 * (scale > 1 ? 1 : scale)}px`;
    };

    resize();
    return {
      update(viewportSize) {
        resize();
      },
    };
  };
</script>

<div class="half-container" class:right>
  <div class="half" use:handleResize={{ viewportSize: $viewport }}>
    <div class="half-name-container">
      <div class="half-name">
        {right ? "R" : "L"}{label.length ? `: ${label}` : ""}
      </div>
    </div>
    {#each sticks as stick}
      <div class={stick} class:right>
        <Joystick data={half[stick]} on:edit-input={handleEditInput(stick)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .half-container {
    width: 100%;
    position: relative;
  }
  .half {
    position: relative;
    width: 520px;
    height: 620px;
    transform-origin: 0 0;
  }

  .half-name-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    font-family: "Arial";
    font-size: xx-large;
    color: #fff;
  }

  .half-name {
    max-width: 200px;
  }

  .half div:hover {
    z-index: 10;
  }
  .half div {
    position: absolute;
  }
  .pinky {
    top: 105px;
  }
  .pinky:is(:not(.right)) {
    left: 0;
  }
  .pinky.right {
    right: 0;
  }
  .ring-north {
    top: 20px;
  }
  .ring-north:is(:not(.right)) {
    left: 90px;
  }
  .ring-north.right {
    right: 90px;
  }
  .middle-north {
    top: 10px;
  }
  .middle-north:is(:not(.right)) {
    left: 230px;
  }
  .middle-north.right {
    right: 230px;
  }
  .index {
    top: 120px;
  }
  .index:is(:not(.right)) {
    left: 340px;
  }
  .index.right {
    right: 340px;
  }
  .thumb-north {
    top: 250px;
  }
  .thumb-north:is(:not(.right)) {
    left: 390px;
  }
  .thumb-north.right {
    right: 390px;
  }
  .thumb-middle {
    top: 360px;
  }
  .thumb-middle:is(:not(.right)) {
    left: 350px;
  }
  .thumb-middle.right {
    right: 350px;
  }
  .thumb-south {
    top: 475px;
  }
  .thumb-south:is(:not(.right)) {
    left: 320px;
  }
  .thumb-south.right {
    right: 320px;
  }
  .ring-south {
    top: 140px;
  }
  .ring-south:is(:not(.right)) {
    left: 110px;
  }
  .ring-south.right {
    right: 110px;
  }
  .middle-south {
    top: 130px;
  }
  .middle-south:is(:not(.right)) {
    left: 225px;
  }
  .middle-south.right {
    right: 225px;
  }
</style>
