<script lang="ts">
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { persistent, storePrefix } from "$lib/createPersistentStore";
  import type { Language } from "$lib/data/languages";
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

  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import { isLanguage, langMap } from "$lib/data/languages";
  import { parseLanguage } from "$lib/langUtils";
  import { migrateLayoutData } from "$lib/schema/migrations";
  import { record as R } from "fp-ts";
  import { getItem } from "localforage";
  import { onMount } from "svelte";
  import { exportData, handleSave, importData } from "./io";

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
    !dev &&
      alert(
        "This is a work in progress. Please report any bugs you find to SilentEcho#0001 on Discord and keep copies of your data. Upload a CCOS CSV to get started."
      );

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
    ($customData, set) => {
      if (!$customData.history.length) set(null);
      set($customData.history[$customData.history.length - 1]);
    }
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

  const selectedLanguage = persistent<Language>("selectedLanguage", "US", {
    generic: isLanguage,
  });

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
    if (
      confirm(
        `Are you sure you want to load the default layout for ${$selectedLanguage}?`
      )
    )
      $customData = {
        _apiVersion: 2,
        createdBy: "",
        createdOn: new Date().toISOString(),
        name: "Custom",
        history: [
          {
            index: 0,
            modifiedOn: new Date().toISOString(),
            state: parseLanguage($selectedLanguage),
          },
        ],
        migration: {
          migrated: true,
          meta: "user restored to default",
        },
      };
  };
</script>

<div class="container">
  <div class="data">
    <select bind:value={$selectedLanguage}>
      {#each R.keys(langMap) as lang}
        <option value={lang}>{lang}</option>
      {/each}
    </select>
    <button on:click={restoreDefault}>Restore Default</button>
    <button on:click={() => importData("self", $customData)}
      >Import CC-Layouts File</button>
    <button on:click={() => exportData("self", $customData, $latest)}
      >Export CC-Layouts File</button>
    <button on:click={() => importData("dot-io", $customData)}
      >Import CCOS CSV File</button>
    <button on:click={() => exportData("dot-io", $customData, $latest)}
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
  <!-- <div class="divider" />
  <div class="layer-select">
    {#if $selectedKeymap !== "A3"}
      <button
        class:active={$selectedModifiers.has("shift")}
        on:click={() => {
          if ($selectedModifiers.has("shift")) {
            $selectedModifiers.delete("shift");
          } else {
            $selectedModifiers.add("shift");
          }

          $selectedModifiers = $selectedModifiers;
        }}>Shift</button
      >{:else}
      <div />{/if}
  </div> -->

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
