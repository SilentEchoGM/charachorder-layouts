<script lang="ts">
  import { goto } from "$app/navigation";
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { languages } from "$lib/data/languages";
  import { parseLanguage } from "$lib/langUtils";
  import type { Layout } from "$lib/schema/v2";
  import type { PageData } from "./$types";

  export let data: PageData;

  let currentLang = data.lang;
  let currentLayout: Layout = parseLanguage(data.lang);

  $: currentLayout = parseLanguage(currentLang);
</script>

<div class="container">
  <div class="flex">
    <div class="language">Language:</div>
    <select
      bind:value={currentLang}
      on:change={() => {
        goto(`/${currentLang}`, {
          replaceState: true,
        });
      }}>
      {#each languages as language}
        <option value={language}>{language}</option>
      {/each}
    </select>

    <button on:click={() => goto(`/`)}> Custom Layouts</button>
  </div>
  <div class="flex">
    <CharaChorderLayout
      layoutLayer={currentLayout.A1}
      label={`Alpha
  (A1)`} />
    <CharaChorderLayout
      layoutLayer={currentLayout.A2}
      label={`Num
  (A2)`} />
    <CharaChorderLayout
      layoutLayer={currentLayout.A2_shift}
      label="Shift + {`NumShift
    (Shift-A2)`}" />
    <CharaChorderLayout
      layoutLayer={currentLayout.A3}
      label={`Fn
  (A3)`} />
  </div>
</div>

<style>
  .flex {
    display: flex;
    gap: 1em;
    max-width: 82em;
    flex-wrap: wrap;
    margin-bottom: 0.5em;
    justify-content: center;
  }
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .language {
    color: white;
    align-self: center;
    font-size: large;
  }
</style>
