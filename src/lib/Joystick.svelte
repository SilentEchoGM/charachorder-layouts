<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import JoystickCentre from "./JoystickCentre.svelte";
  import JoystickSegment from "./JoystickSegment.svelte";
  import type { JoystickDirection, JoystickInput } from "./schema/v1";

  export let data: Record<JoystickDirection | "center", string> = {
    top: "Backspace",
    left: "Space",
    right: "R",
    bottom: "E",
    center: "Q",
  };

  export let size = 200;

  const emit = createEventDispatcher();

  const handleEditInput = (input: JoystickInput) => (_event: CustomEvent) => {
    emit("edit-input", {
      input,
    });
  };
</script>

<div class="container">
  <div class="center">
    <JoystickCentre
      text={data.center}
      on:edit-input={handleEditInput("center")} />
  </div>
  <div class="left">
    <JoystickSegment
      direction="left"
      text={data.left}
      {size}
      on:edit-input={handleEditInput("left")} />
  </div>
  <div class="right">
    <JoystickSegment
      direction="right"
      text={data.right}
      {size}
      on:edit-input={handleEditInput("right")} />
  </div>
  <div class="top">
    <JoystickSegment
      direction="top"
      text={data.top}
      {size}
      on:edit-input={handleEditInput("top")} />
  </div>
  <div class="bottom">
    <JoystickSegment
      direction="bottom"
      text={data.bottom}
      {size}
      on:edit-input={handleEditInput("bottom")} />
  </div>
</div>

<style>
  .container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 35px);
    grid-template-rows: repeat(3, 35px);
    align-items: center;
    justify-items: center;
  }
  .container div {
    width: 100%;
    height: 100%;
  }
  .center {
    width: var(--joystick-segment-size);
    height: var(--joystick-segment-size);
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  :root {
    --joystick-segment-size: -50%;
  }
  .left {
    grid-column: 1 / span 1;
    grid-row: 1 / span 3;
  }
  .right {
    grid-column: 3 / span 1;
    grid-row: 1 / span 3;
  }
  .top {
    grid-column: 1 / span 3;
    grid-row: 1 / span 1;
  }
  .bottom {
    grid-column: 1 / span 3;
    grid-row: 3 / span 1;
  }
</style>
