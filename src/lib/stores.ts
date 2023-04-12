import { derived, writable, type Readable } from "svelte/store";
import { persistent } from "./createPersistentStore";
import {
  defaultLayout,
  v2LayoutData,
  type DefaultLayer,
  type JoystickInput,
  type Layout,
  type LayoutData,
  type LayoutHistoryData,
  type Stick,
} from "./schema/v2";

import {
  array as A,
  either as E,
  eq as Eq,
  date as FDate,
  set as FSet,
  map as M,
  option as O,
  ord as Ord,
  record as R,
  readonlyArray as RA,
  state as S,
  string as Str,
  task as T,
  taskEither as TE,
  function as f,
} from "fp-ts";
import { compareLayoutToDefault, getLatest } from "./utils";

export const editModal = writable<{
  half: "left" | "right";
  stick: Stick;
  input: JoystickInput;
  open: boolean;
  value: string;
}>({
  half: "left",
  stick: "index",
  input: "bottom",
  open: false,
  value: "",
});

export const customData = persistent<LayoutData>(
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

export const latest = derived<typeof customData, null | LayoutHistoryData>(
  customData,
  ($customData) =>
    f.pipe(
      $customData,
      getLatest,
      O.getOrElseW(() => null)
    )
);
export const selectedKeymap = writable<DefaultLayer>("A1");
export const selectedModifiers = writable<Set<"shift" | "alt-gr">>(new Set());

export const selectedLayer: Readable<DefaultLayer> = derived(
  [selectedModifiers, selectedKeymap],
  ([$mods, $map]) => {
    if ($mods.has("shift")) {
      return ($map + "_shift") as DefaultLayer;
    } else {
      return $map;
    }
  }
);

export const changes = derived(latest, ($latest) =>
  $latest ? compareLayoutToDefault($latest.state) : null
);
