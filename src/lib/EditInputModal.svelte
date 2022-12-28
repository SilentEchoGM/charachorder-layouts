<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";
  import { clickOutside } from "./actions";

  import { editModal } from "./stores";

  const emit = createEventDispatcher();

  let input: HTMLInputElement;

  const open = derived(editModal, ($editModal) => $editModal.open);

  $: if (open && input) {
    input.focus();
    input.select();
  }
</script>

<div
  class="container"
  on:keydown={({ key }) => {
    if ($open && key === "Escape") {
      editModal.set({ ...$editModal, open: false });
    }
  }}>
  <div class="modal-bg" />
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
    </div>

    <div>
      Edit: <input
        bind:this={input}
        type="text"
        bind:value={$editModal.value} />
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
  </div>
</div>

<style>
  .container,
  .modal-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .container {
    z-index: 1000;
  }
  .modal-bg {
    color: white;
  }
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: gray;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: black;
    display: grid;

    text-align: center;
    gap: 1rem;
    font-size: large;
    align-items: baseline;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
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

  button {
    background-color: hsl(110, 100%, 25%);
    color: white;
    cursor: default;
  }
  .cancel {
    background-color: hsl(0, 100%, 25%);
  }
</style>
