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
  import { derived, writable } from "svelte/store";

  import { goto } from "$app/navigation";
  import { isLanguage, langMap } from "$lib/data/languages";
  import { parseLanguage } from "$lib/langUtils";
  import { migrateLayoutData } from "$lib/schema/migrations";
  import { record as R } from "fp-ts";
  import { getItem } from "localforage";
  import { onMount } from "svelte";

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

  const selectedLayer = writable<DefaultLayer>("A1");
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

  const handleSave = ({
    detail,
  }: CustomEvent<{
    input: JoystickInput;
    stick: Stick;
    half: "left" | "right";
    value: string;
  }>) => {
    customData.update(($customData) => {
      const parsed = v2Both.safeParse(
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
              modifiedOn: new Date().toISOString(),
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

  const exportData = () => {
    const a = document.createElement("a");
    a.href =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify($customData, null, 2));
    a.download = "layout.json";
    a.click();
  };

  const importData = () => {
    if (
      !confirm(
        "Are you sure you want to import a layout? This will overwrite your current layout."
      )
    )
      return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (text) {
            const obj = JSON.parse(text as string);
            console.log("importing data", obj);
            const parsed = v2LayoutData.safeParse(obj);
            if (parsed.success) {
              $customData = parsed.data;
            } else {
              const parsed = migrateLayoutData(1, 2, obj);
              if (parsed.success) {
                $customData = parsed.data;
              } else {
                alert("Invalid file");
                console.error(parsed.error);
              }
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
    <button on:click={importData}>Import</button>
    <button on:click={exportData}>Export</button>
    <button
      on:click={() => {
        goto("/");
      }}>View Default Layouts</button>
  </div>
  <div class="divider" />
  <div class="layer-select">
    <button
      class:active={$selectedLayer === "A1"}
      on:click={() => {
        $selectedLayer = "A1";
      }}>None</button
    ><button
      class:active={$selectedLayer === "A1_shift"}
      on:click={() => {
        $selectedLayer = "A1_shift";
      }}>Shift</button>
    <button
      class:active={$selectedLayer === "A2"}
      on:click={() => {
        $selectedLayer = "A2";
      }}>Num-shift</button>
    <button
      class:active={$selectedLayer === "A2_shift"}
      on:click={() => {
        $selectedLayer = "A2_shift";
      }}>Shift & Num-shift</button>
    <button
      class:active={$selectedLayer === "A3"}
      on:click={() => {
        $selectedLayer = "A3";
      }}>Fn</button>
  </div>

  {#if $latest}
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

  .layer-select button.active {
    background-color: #fff;
    color: #444;
  }
</style>
