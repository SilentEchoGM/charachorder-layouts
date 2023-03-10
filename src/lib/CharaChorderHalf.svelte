<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Joystick from "./Joystick.svelte";
  import {
    sticks,
    type Half,
    type JoystickInput,
    type Stick,
  } from "./schema/v2";

  export let right = false;
  export let half: Half;

  const emit = createEventDispatcher();

  const handleEditInput =
    (stick: Stick) =>
    ({ detail }: CustomEvent<{ input: JoystickInput }>) => {
      emit("edit-input", {
        stick,
        input: detail.input,
      });
    };
</script>

<div class="half" class:right>
  <svg viewBox="0 0 98 52" width={520} height={620}>
    <path
      d="M 5 -20
    A 34 36 0 0 1 70 84 
  "
      stroke="white"
      stroke-width="1"
      opacity="0.5"
      fill="rgba(50,50,50,0.5)" />
    <path
      d="M 90 10
      A 30 50 0 0 0 62 84
    "
      stroke="white"
      stroke-width="1"
      opacity="0.5"
      fill="none" />
  </svg>
  {#each sticks as stick}
    <div class={stick} class:right>
      <Joystick data={half[stick]} on:edit-input={handleEditInput(stick)} />
    </div>
  {/each}
</div>

<style>
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 520px;
    height: 620px;
  }
  .right svg {
    transform: scaleX(-1);
  }
  .half {
    position: relative;
    width: 520px;
    height: 620px;
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
