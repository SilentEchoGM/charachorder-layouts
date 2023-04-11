<script lang="ts">
  import { clipboard } from "@svelteuidev/composables";

  let copied = false;

  const onCopy = () => {
    copied = true;
    setTimeout(() => (copied = false), 1200);
  };
</script>

<div class="container">
  <slot>??? Contact <i class="fa-brands fa-discord" /> SilentEcho#0001</slot>

  <div class="footer">
    <a href="http://preview.charalayouts.com">
      <i class="fa-solid fa-circle-chevron-right" /> Check out the Preview</a>
    <a href="https://github.com/SilentEchoGM/charachorder-layouts/issues">
      <i class="fa-brands fa-github" /> Report an Issue</a>
    |
    <span>Contact the Developer:</span>
    <a href="http://www.twitter.com/SilentEchoGM">
      <i class="fa-brands fa-twitter" /> @SilentEchoGM</a>

    <button use:clipboard={"SilentEcho#0001"} on:click={onCopy}
      ><i class="fa-brands fa-discord" />
      <span>
        {#if copied}
          Copied!{:else}SilentEcho#0001{/if}
      </span></button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: calc(100dvh - 16px);
    min-width: calc(100vh - 16px);
    box-sizing: border-box;
  }
  .footer {
    justify-content: center;
    display: flex;
    gap: 1rem;
    margin-top: auto;
    color: rgb(138, 138, 138);
  }

  a,
  button {
    all: unset;
    cursor: pointer;
  }

  button {
    display: grid;
    gap: 1rem;
    grid-template-columns: 20px 150px;
  }
</style>
