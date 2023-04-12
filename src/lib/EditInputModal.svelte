<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";
  import { clickOutside } from "./actions";
  import { getSwitchNumber } from "./data/switches";

  import {
    function as f,
    number as FNumber,
    ord as Ord,
    readonlyArray as RA,
  } from "fp-ts";

  import { ccosCodeIds } from "./data/ccosCodeIds";
  import { defaultLayout, getSwitchValueByLocation } from "./schema/v2";
  import { editModal, latest, selectedKeymap } from "./stores";
  import { mCompareTwoStrings } from "./utils";

  const emit = createEventDispatcher();

  let input: HTMLInputElement;

  const open = derived(editModal, ($editModal) => $editModal.open);

  $: if (open && input) {
    input.focus();
    input.select();
  }

  const suggestions = derived(editModal, ({ value }) =>
    value.trim().length
      ? f.pipe(
          ccosCodeIds,
          RA.map((code) => ({
            ...code,
            sort: Math.max(
              mCompareTwoStrings(code.utf8.toLowerCase(), value.toLowerCase()),
              mCompareTwoStrings(code.codeId, value.toLowerCase()),
              code.description.toLowerCase().includes(value.toLowerCase())
                ? 0.52
                : 0,
              code.notes.toLowerCase().includes(value.toLowerCase()) ? 0.51 : 0
            ),
          })),
          RA.filter(
            (code) =>
              code.sort > 0.5 ||
              code.utf8.toLowerCase().includes(value.toLowerCase())
          ),
          RA.sortBy([
            Ord.contramap(
              (code: { sort: number; codeId: string }) => code.sort
            )(FNumber.Ord),
            Ord.contramap((code: { codeId: string; sort: number }) =>
              parseInt(code.codeId)
            )(FNumber.Ord),
          ]),
          RA.reverse
        )
      : []
  );
</script>

<div
  class="container"
  on:keydown={({ key }) => {
    if ($open && key === "Escape") {
      editModal.set({ ...$editModal, open: false });
    }
    if ($open && key === "Enter") {
      emit("save", $editModal);
      editModal.set({ ...$editModal, open: false });
    }
  }}>
  <div class="modal-bg">
    <div
      class="modal"
      use:clickOutside={{
        enabled: $open,
        handler: (e) => {
          console.log("click outside modal handler");
          editModal.set({ ...$editModal, open: false });
        },
      }}>
      <div class="path">
        {$editModal.half}-half/{$editModal.stick}-stick/{$editModal.input}-input
        ({getSwitchNumber($editModal)})
      </div>

      <div class="buttons">
        <button
          on:click={() => {
            emit("save", $editModal);
            editModal.set({ ...$editModal, open: false });
          }}>Save</button>
        <button
          class="cancel"
          on:click={() => {
            editModal.set({ ...$editModal, open: false });
          }}>Cancel</button>
      </div>
      <button
        class="default"
        on:click={() => {
          emit("save", {
            ...$editModal,
            value:
              defaultLayout[$selectedKeymap][$editModal.half][$editModal.stick][
                $editModal.input
              ],
          });
          editModal.set({ ...$editModal, open: false });
        }}
        >Reset to Default: ({defaultLayout[$selectedKeymap][$editModal.half][
          $editModal.stick
        ][$editModal.input]})</button>
      <div class="current">
        Current Mapping: <strong
          >{$latest
            ? getSwitchValueByLocation({
                ...$editModal,
                layer: $selectedKeymap,
              })($latest.state)
            : ""}
        </strong>
      </div>
      <div class="edit">
        Edit: <input
          bind:this={input}
          type="text"
          bind:value={$editModal.value} />
      </div>

      <div class="suggestions">
        {#if $editModal.value.length > 0}
          {#each $suggestions as suggestion (suggestion.codeId)}
            <button
              class="suggestion"
              style:background-color="hsl(110, {100 * suggestion.sort}%, {10 +
                15 * suggestion.sort}%)"
              on:click={() => {
                editModal.set({ ...$editModal, value: suggestion.utf8 });
              }}>
              <span class="suggestion-utf8">{suggestion.utf8}</span>
              <br />
              {#if suggestion.utf8.toLowerCase().includes("ksc")}
                <div class="suggestion-other">{suggestion.description}</div>
              {/if}
            </button>
          {/each}{/if}
      </div>
    </div>
  </div>
</div>

<style>
  .suggestion-other {
    font-size: medium;
    font-weight: 300;
    word-wrap: break-word;
  }
  .container,
  .modal-bg {
    justify-content: center;
    align-items: center;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .container {
    z-index: 1000;
  }
  .modal-bg {
    color: white;
  }
  .modal {
    background-color: gray;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: black;
    display: grid;
    height: 40vh;
    text-align: center;
    gap: 0.5rem;
    font-size: large;
    align-items: baseline;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto auto 1fr;
    justify-content: center;
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    grid-column: 1 / span 2;
    justify-self: center;
  }
  .path {
    background-color: darkgray;
    padding: 3px;
    border-radius: 0.25rem;
    grid-column: 1 / span 2;
  }

  input,
  button {
    all: unset;
    border: none;

    width: 5em;
    text-align: center;
    background-color: hsl(0, 0%, 15%);
    color: lightgray;
    padding: 3px;
    border-radius: 0.25rem;
  }

  input {
    width: 10em;
  }

  button {
    background-color: hsl(110, 100%, 25%);
    color: white;
    cursor: default;
  }
  .suggestions {
    grid-column: 1 / span 2;
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, 1fr);
    overflow-y: auto;
    max-height: 100%;
  }
  button.suggestion {
    width: 9em;
  }
  .default {
    width: unset;
    min-width: 12em;
    grid-column: 1 / span 2;
    justify-self: center;
    word-wrap: break-word;
    background-color: rgb(54, 54, 54);
  }
  .cancel {
    background-color: hsl(0, 100%, 25%);
  }
  .edit {
    justify-self: center;
    grid-column: 1 / span 2;
  }
  .current {
    justify-self: center;
    grid-column: 1 / span 2;
  }
</style>
