<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import { possibleLanguages } from "./languages";

  export let data: PageData;

  let currentLang: string = data.lang;
</script>

<div class="flex">
  <span>Language:</span>
  <select
    bind:value={currentLang}
    on:change={() => {
      goto(`/${currentLang}`);
    }}>
    {#each possibleLanguages as language}
      <option value={language}>{language}</option>
    {/each}
  </select>
</div>
<div class="flex">
  <img src="/images/{data.lang}--character-entry.png" alt="" />
  <img src="/images/{data.lang}--shift-character-entry.png" alt="" />

  <img src="/images/{data.lang}--numshift.png" alt="" />
  <img src="/images/{data.lang}--shift-numshift.png" alt="" />
</div>

<style>
  .flex {
    display: flex;
    gap: 1em;
    max-width: 82em;
    flex-wrap: wrap;
  }
  img {
    width: 40em;
  }
</style>
