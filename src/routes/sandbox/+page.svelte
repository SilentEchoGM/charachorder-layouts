<script lang="ts">
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { persistent } from "$lib/createPersistentStore";
  import EditInputModal from "$lib/EditInputModal.svelte";
  import Joystick from "$lib/Joystick.svelte";
  import JoystickCentre from "$lib/JoystickCentre.svelte";
  import JoystickSegment from "$lib/JoystickSegment.svelte";
  import {
    type DefaultLayer,
    defaultLayout,
    v1LayoutData,
    type LayoutData,
    type JoystickInput,
    type Stick,
    type Layout,
    v1Layout,
    v1Both,
  } from "$lib/schema/v1";
  import { editModal } from "$lib/stores";
  import { derived, writable } from "svelte/store";

  const customData = persistent<LayoutData>(
    "customLayout",
    {
      _apiVersion: 1,
      createdBy: "",
      createdOn: new Date(),
      name: "Custom",
      history: [
        {
          index: 0,
          modifiedOn: new Date(),
          state: { ...defaultLayout } as Layout,
        },
      ],
    },
    v1LayoutData.safeParse
  );

  const latest = derived(customData, ($customData) => {
    return $customData.history[$customData.history.length - 1];
  });

  $: if ($customData.history.length === 0) {
    $customData.history.push({
      index: 0,
      modifiedOn: new Date(),
      state: { ...defaultLayout },
    });
  }

  const selectedLayer = writable<DefaultLayer>("__base");

  const handleEditInput = ({
    detail,
  }: CustomEvent<{
    input: JoystickInput;
    stick: Stick;
    half: "left" | "right";
  }>) => {
    const parsed = v1Both.safeParse($latest.state[$selectedLayer]);
    if (parsed.success) {
      $editModal = {
        input: detail.input,
        stick: detail.stick,
        half: detail.half,
        open: true,
        value: parsed.data[detail.half][detail.stick][detail.input],
      };
    }
  };

  const handleSave = ({
    detail,
  }: CustomEvent<{
    input: JoystickInput;
    stick: Stick;
    half: "left" | "right";
    value: string;
  }>) => {
    customData.update(($customData) => {
      const parsed = v1Both.safeParse(
        $customData.history[$customData.history.length - 1].state[
          $selectedLayer
        ]
      );

      if (parsed.success) {
        console.log("Saving", detail);
        return {
          ...$customData,
          history: [
            ...$customData.history,
            {
              index: $customData.history.length,
              modifiedOn: new Date(),
              state: {
                ...$customData.history[$customData.history.length - 1].state,
                [$selectedLayer]: {
                  ...parsed.data,
                  [detail.half]: {
                    ...parsed.data[detail.half],
                    [detail.stick]: {
                      ...parsed.data[detail.half][detail.stick],
                      [detail.input]: detail.value,
                    },
                  },
                },
              },
            },
          ],
        };
      }
      return $customData;
    });
  };
  const restoreDefault = () => {
    if (confirm("Are you sure you want to restore the default layout?"))
      $customData = {
        _apiVersion: 1,
        createdBy: "",
        createdOn: new Date(),
        name: "Custom",
        history: [
          {
            index: 0,
            modifiedOn: new Date(),
            state: { ...defaultLayout } as Layout,
          },
        ],
      };
  };

  const exportData = () => {
    const a = document.createElement("a");
    a.href =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify($customData, null, 2));
    a.download = "layout.json";
    a.click();
  };
</script>

<div class="container">
  <div class="data">
    <button on:click={restoreDefault}>Restore Default</button>
    <button on:click={exportData}>Export</button>
  </div>
  <div class="layer-select">
    <button
      class:active={$selectedLayer === "__base"}
      on:click={() => {
        $selectedLayer = "__base";
      }}>None</button
    ><button
      class:active={$selectedLayer === "__shift"}
      on:click={() => {
        $selectedLayer = "__shift";
      }}>Shift</button>
    <button
      class:active={$selectedLayer === "__num-shift"}
      on:click={() => {
        $selectedLayer = "__num-shift";
      }}>Num-shift</button>
    <button
      class:active={$selectedLayer === "__shift-num-shift"}
      on:click={() => {
        $selectedLayer = "__shift-num-shift";
      }}>Shift & Num-shift</button>
  </div>

  {#if $customData.history.length > 0}
    {#key $latest}
      <CharaChorderLayout
        on:edit-input={handleEditInput}
        layoutLayer={$latest.state[$selectedLayer]} />
    {/key}
  {/if}

  {#if $editModal.open}
    <EditInputModal on:save={handleSave} />
  {/if}
</div>

<!-- <Joystick /> -->
<style>
  :global(html) {
    font-weight: bold;
    font-family: "Consolas";
  }
  .container {
    position: relative;
    min-width: 1100px;
  }
  .layer-select {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  button {
    padding: 0.5em;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 0.5em;
    font-size: 1rem;
  }

  .layer-select button.active {
    background-color: #fff;
    color: #444;
  }
</style>
