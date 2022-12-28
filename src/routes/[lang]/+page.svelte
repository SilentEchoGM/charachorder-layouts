<script lang="ts">
  import { goto } from "$app/navigation";
  import { persistent } from "$lib/createPersistentStore";
  import type { DefaultLayer } from "$lib/schema/v1";
  import { writable } from "svelte/store";

  import { isLanguage, languages, type Language } from "$lib/data/languages";
  import CharaChorderLayout from "$lib/CharaChorderLayout.svelte";
  import { parseLanguage } from "$lib/langUtils";

  const selectedLanguage = persistent<Language>("selectedLanguage", "US", {
    generic: isLanguage,
  });
</script>

<div class="flex">
  <select
    bind:value={$selectedLanguage}
    on:change={() => {
      goto(`/${$selectedLanguage}`);
    }}>
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
  <div>
    <CharaChorderLayout layoutLayer={parseLanguage($selectedLanguage).__base} />
  </div>
  <div>
    <CharaChorderLayout
      layoutLayer={parseLanguage($selectedLanguage).__shift} />
  </div>
  <div>
    <CharaChorderLayout
      layoutLayer={parseLanguage($selectedLanguage)["__num-shift"]} />
  </div>
  <div>
    <CharaChorderLayout
      layoutLayer={parseLanguage($selectedLanguage)["__shift-num-shift"]} />
  </div>
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
