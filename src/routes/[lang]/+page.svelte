<script lang="ts">
  import { goto } from "$app/navigation";
  import { persistent } from "$lib/createPersistentStore";

  import { isLanguage, languages, type Language } from "$lib/data/languages";
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { parseLanguage } from "$lib/langUtils";
  import type { PageData } from "./$types";
  export let data: PageData;
  const selectedLanguage = persistent<Language>("selectedLanguage", data.lang, {
    generic: isLanguage,
  });

  const defaultLayers = [
    "__base",
    "__shift",
    "__num-shift",
    "__shift-num-shift",
  ] as const;

  $: goto(`/${$selectedLanguage}`);
</script>

<div class="flex">
  <select bind:value={$selectedLanguage}>
    {#each languages as language}
      <option value={language}>{language}</option>
    {/each}
  </select>
  <button
    on:click={() => {
      goto("/custom");
    }}>Custom Layouts</button>
</div>
<div class="flex">
  {#each defaultLayers as layer}
    {#key $selectedLanguage}
      <div>
        <CharaChorderLayout
          layoutLayer={parseLanguage($selectedLanguage)[layer]} />
      </div>
    {/key}
  {/each}
</div>

<style>
  .flex {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    margin: 1em 0.5em;
    justify-content: center;
  }
  .flex div {
    background-color: hsl(0, 0%, 15%);
    border-radius: 8em;
  }
</style>
