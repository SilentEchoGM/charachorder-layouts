<script lang="ts">
  import { readonlyArray as RA } from "fp-ts";
  import { function as f } from "fp-ts";
  import { array as A } from "fp-ts";
  import { option as O } from "fp-ts";
  import { either as E } from "fp-ts";
  import { map as M } from "fp-ts";
  import { task as T } from "fp-ts";
  import { taskEither as TE } from "fp-ts";
  import { ord as Ord } from "fp-ts";
  import { eq as Eq } from "fp-ts";
  import { record as R } from "fp-ts";
  import { string as Str } from "fp-ts";
  import { state as S } from "fp-ts";
  import { set as FSet } from "fp-ts";
  import { date as FDate } from "fp-ts";

  import { fit, parent_style } from "@leveluptuts/svelte-fit";
  import {
    moveTo,
    segmentBottom,
    segmentTop,
    simplePythagoras,
    segmentLeft,
    segmentRight,
  } from "./svg";
  import type { JoystickDirection } from "./schema/v1";
  import { createEventDispatcher } from "svelte";
  import { mousePosition } from "./mousePos";

  export let size = 150;
  export let direction: JoystickDirection = "top";
  export let text = "Q";

  const radius = size / 3;
  const segment = () => {
    switch (direction) {
      case "top":
        return segmentTop(radius);
      case "left":
        return segmentLeft(radius);
      case "right":
        return segmentRight(radius);
      case "bottom":
        return segmentBottom(radius);
    }
  };

  let container: HTMLDivElement;
  const breakString = (str: string) =>
    f.pipe(
      str.split(""),
      A.chunksOf(4),
      A.takeLeft(2),
      A.map((chunk) => chunk.join("")),
      A.reduce("", (acc, curr) => acc + " " + curr)
    );

  const horizontal = direction === "left" || direction === "right";
  const vertical = direction === "top" || direction === "bottom";
  const width = horizontal
      ? simplePythagoras(radius / 2)
      : simplePythagoras(radius),
    height = vertical ? simplePythagoras(radius / 2) : simplePythagoras(radius);

  const emit = createEventDispatcher();

  const accessibleClick = ({ key }: KeyboardEvent) => {
    console.log("key", key);
    if (key === "q" && mousePosition.check(container)) emit("edit-input");
  };
</script>

<div
  bind:this={container}
  class="container"
  on:click={() => {
    emit("edit-input");
  }}
  on:keydown={accessibleClick}
  role="button">
  <svg viewBox="-{width / 2} -{height / 2} {width} {height}">
    <path d={segment() + "Z"} fill="black" stroke="#555" stroke-width={4} />
  </svg>
  <div class="text-container {direction}">
    <div
      class="autosize"
      use:fit={{
        min_size: 15,
        max_size: 19,
      }}>
      <div class="text" class:long={text.length > 2}>
        {text.length > 6 ? breakString(text) : text}
      </div>
    </div>
  </div>
</div>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  div.container {
    position: relative;
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .text-container {
    position: absolute;
    width: 40%;
    height: 60%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    font-family: "Arial";
    z-index: 10;
  }

  .autosize {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .left .text.long {
    writing-mode: sideways-lr;
  }
  .right .text.long {
    writing-mode: sideways-lr;
  }

  .text {
    line-height: 90%;
    letter-spacing: 0.5px;
  }
</style>
