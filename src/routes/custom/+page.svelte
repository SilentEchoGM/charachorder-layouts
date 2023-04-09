<script lang="ts">
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { persistent, storePrefix } from "$lib/createPersistentStore";
  import EditInputModal from "$lib/EditInputModal.svelte";
  import {
    defaultLayout,
    v2Both,
    v2LayoutData,
    type DefaultLayer,
    type JoystickInput,
    type Layout,
    type LayoutData,
    type LayoutHistoryData,
    type Stick,
  } from "$lib/schema/v2";
  import { editModal } from "$lib/stores";
  import { derived, writable, type Readable } from "svelte/store";

  import { goto } from "$app/navigation";
  import { migrateLayoutData } from "$lib/schema/migrations";
  import { getLatest } from "$lib/utils";
  import { option as O } from "fp-ts";
  import { getItem } from "localforage";
  import { onMount } from "svelte";
  import { exportData, handleSave, importData } from "./io";

  import { function as f } from "fp-ts";

  const customData = persistent<LayoutData>(
    "v2:customLayout",
    {
      _apiVersion: 2,
      createdBy: "",
      createdOn: new Date().toISOString(),
      name: "Custom",
      history: [
        {
          index: 0,
          modifiedOn: new Date().toISOString(),
          state: { ...defaultLayout } as Layout,
        },
      ],
      migration: {
        migrated: false,
        meta: "default",
      },
    },
    { zod: v2LayoutData.safeParse }
  );

  onMount(async () => {
    await customData.load();

    const migrate = async () => {
      //version 1
      const prevData = await getItem(storePrefix + "customLayout");

      console.log("prevData", prevData);
      const migrated = migrateLayoutData(1, 2, prevData);

      if (migrated.success) {
        console.log("Migrate data", migrated.data, prevData);
        $customData = migrated.data;
      } else {
        console.error("Failed to migrate data", migrated.error);
      }
    };

    if (!$customData.migration.migrated) {
      migrate();
    }
    window.manualMigrate = migrate;
  });

  const latest = derived<typeof customData, null | LayoutHistoryData>(
    customData,
    ($customData) =>
      f.pipe(
        $customData,
        getLatest,
        O.getOrElseW(() => null)
      )
  );

  $: if ($customData.history.length === 0) {
    $customData.history.push({
      index: 0,
      modifiedOn: new Date().toISOString(),
      state: { ...defaultLayout },
    });
  }

  const selectedKeymap = writable<DefaultLayer>("A1");
  const selectedModifiers = writable<Set<"shift" | "alt-gr">>(new Set());

  const selectedLayer: Readable<DefaultLayer> = derived(
    [selectedModifiers, selectedKeymap],
    ([$mods, $map]) => {
      if ($mods.has("shift")) {
        return ($map + "_shift") as DefaultLayer;
      } else {
        return $map;
      }
    }
  );

  const handleEditInput = ({
    detail,
  }: CustomEvent<{
    input: JoystickInput;
    stick: Stick;
    half: "left" | "right";
  }>) => {
    if (!$latest) return;
    const parsed = v2Both.safeParse($latest.state[$selectedLayer]);
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

  const restoreDefault = () => {
    if (confirm(`Are you sure you want to load the default layout?`)) {
      $customData = {
        ...$customData,
        history: [
          ...$customData.history,
          {
            index: $customData.history.length,
            modifiedOn: new Date().toISOString(),
            state: { ...defaultLayout },
          },
        ],
      };
      console.log("restored default", $customData);
    }
  };
</script>

<div class="container">
  <div class="data">
    <button on:click={restoreDefault}>Restore Default</button>
    <button on:click={() => importData("self", customData)}
      >Import CC-Layouts File</button>
    <button on:click={() => exportData("self", $customData)}
      >Export CC-Layouts File</button>
    <button on:click={() => importData("dot-io", customData)}
      >Import CCOS CSV File</button>
    <button on:click={() => exportData("dot-io", $customData)}
      >Export CCOS CSV File</button>
    <button
      on:click={() => {
        goto("/");
      }}>View Default Layouts</button>
  </div>
  <div class="divider" />
  <div class="layer-select">
    <button
      class:active={$selectedKeymap === "A1"}
      on:click={() => {
        $selectedKeymap = "A1";
      }}>Alpha</button>
    <button
      class:active={$selectedKeymap === "A2"}
      on:click={() => {
        $selectedKeymap = "A2";
      }}>Num</button>

    <button
      class:active={$selectedKeymap === "A3"}
      on:click={() => {
        $selectedKeymap = "A3";
        $selectedModifiers = new Set();
      }}>Fn</button>
  </div>

  {#if $latest}
    {#key $latest}
      {#key $selectedLayer}
        <CharaChorderLayout
          on:edit-input={handleEditInput}
          layoutLayer={$latest.state[$selectedLayer]} />
      {/key}
    {/key}
  {/if}

  {#if $editModal.open}
    <EditInputModal
      on:save={(detail) => handleSave(detail, customData, $selectedLayer)} />
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .divider {
    width: 150px;
    background-color: #666;
    height: 3px;
    border-radius: 50%;
  }
  .layer-select,
  .data {
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .layer-select {
    z-index: 100;
  }

  .layer-select button.active {
    background-color: #fff;
    color: #444;
  }
</style>
