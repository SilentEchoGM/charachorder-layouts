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
</script>

<div class="flex">
  <span>Language:</span>
  <select
    bind:value={currentLang}
    on:change={() => {
      goto(`/${currentLang}`);
    }}>
    {#each languages as language}
      <option value={language}>{language}</option>
    {/each}
  </select>

  <button on:click={() => goto(`/custom`)}> Custom </button>
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

<style>
  .flex {
    display: flex;
    gap: 1em;
    max-width: 82em;
    flex-wrap: wrap;
    margin-bottom: 0.5em;
  }
</style>
