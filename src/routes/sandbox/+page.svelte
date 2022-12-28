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
  import type { Language } from "$lib/data/languages";

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
  import { langMap } from "$lib/data/languages";
  import { isLanguage } from "../[lang]/languages";
  import { parseLanguage } from "$lib/langUtils";

  const customData = persistent<LayoutData>(
    "customLayout",
    {
      _apiVersion: 1,
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
    },
    { zod: v1LayoutData.safeParse }
  );

  const latest = derived(customData, ($customData) => {
    return $customData.history[$customData.history.length - 1];
  });

  $: if ($customData.history.length === 0) {
    $customData.history.push({
      index: 0,
      modifiedOn: new Date().toISOString(),
      state: { ...defaultLayout },
    });
  }

  const selectedLayer = writable<DefaultLayer>("__base");
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
        _apiVersion: 1,
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
            const parsed = v1LayoutData.safeParse(JSON.parse(text as string));
            if (parsed.success) {
              $customData = parsed.data;
            } else {
              alert("Invalid file");
              console.error(parsed.error);
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
  </div>
  <div class="divider" />
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
  button,
  select {
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
