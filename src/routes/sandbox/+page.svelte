<script lang="ts">
  import { getSwitchInputLocation, getSwitchNumber } from "$lib/data/switches";
  import EditInputModal from "$lib/EditInputModal.svelte";

  import { array as A, function as f } from "fp-ts";
  import { range } from "fp-ts/lib/NonEmptyArray";

  f.pipe(
    getSwitchNumber({
      hand: "right",
      input: "left",
      stick: "middle-south",
    }),
    console.log
  );
</script>

<EditInputModal />
