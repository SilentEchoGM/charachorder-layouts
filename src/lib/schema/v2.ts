import { defaultMerge } from "$lib/utils";
import { z } from "zod";
import type { v1 } from "./v1";

import {
  array as A,
  date as FDate,
  either as E,
  eq as Eq,
  function as f,
  map as M,
  option as O,
  ord as Ord,
  readonlyArray as RA,
  record as R,
  set as FSet,
  state as S,
  string as Str,
  task as T,
  taskEither as TE,
} from "fp-ts";

export const v2Joystick = z.object({
  top: z.string(),
  left: z.string(),
  right: z.string(),
  bottom: z.string(),
  center: z.string(),
});

export const sticks = [
  "ring-north",
  "middle-north",
  "index",
  "thumb-north",
  "thumb-middle",
  "thumb-south",
  "middle-south",
  "ring-south",
  "pinky",
] as const;

export const v2Stick = z.enum(sticks);

export const v2Half = z.object({
  "ring-north": v2Joystick,
  "middle-north": v2Joystick,
  index: v2Joystick,
  "thumb-north": v2Joystick,
  "thumb-middle": v2Joystick,
  "thumb-south": v2Joystick,
  "middle-south": v2Joystick,
  "ring-south": v2Joystick,
  pinky: v2Joystick,
});

export const v2Both = z.object({
  left: v2Half,
  right: v2Half,
});

export const v2DefaultLayers = z.object({
  A1: v2Both,
  A1_shift: v2Both,
  A2: v2Both,
  A2_shift: v2Both,
  A3: v2Both,
  A3_shift: v2Both,
});

export const v2Layout = z.union([v2DefaultLayers, z.record(v2Both)]);

export const v2LayoutHistoryData = z.object({
  modifiedOn: z.string(),
  state: v2Layout,
  index: z.number(),
});

export const v2LayoutData = z.object({
  _apiVersion: z.literal(2),
  createdBy: z.string(),
  createdOn: z.string(),
  name: z.string(),
  history: z.array(v2LayoutHistoryData),
  migration: z.object({
    migrated: z.boolean(),
    meta: z.string(),
  }),
});

export const v2SwitchLocation = z.object({
  hand: z.enum(["left", "right"]),
  stick: v2Stick,
  input: z.enum(["top", "left", "right", "bottom", "center"]),
});

export const defaultLayout: Layout = {
  A1: {
    left: {
      "ring-north": {
        top: "ctrl",
        left: ",",
        right: "'",
        bottom: "u",
        center: "",
      },

      "middle-north": {
        top: "del",
        left: ".",
        right: "i",
        bottom: "o",
        center: "",
      },
      index: {
        top: "bksp",
        left: "space",
        right: "r",
        bottom: "e",
        center: "",
      },
      "middle-south": {
        top: "\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "M0",
        left: "g",
        right: "w",
        bottom: "z",
        center: "",
      },
      "thumb-north": {
        top: "v",
        left: "m",
        right: "k",
        bottom: "c",
        center: "",
      },
      "thumb-south": {
        top: "-",
        left: "win",
        right: "/",
        bottom: "esc",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "ctrl",
        left: "y",
        right: ";",
        bottom: "s",
        center: "",
      },

      "middle-north": {
        top: "tab",
        left: "l",
        right: "j",
        bottom: "n",
        center: "",
      },
      index: {
        top: "enter",
        left: "a",
        right: "space",
        bottom: "t",
        center: "",
      },
      "middle-south": {
        top: "\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "x",
        left: "b",
        right: "dup",
        bottom: "q",
        center: "",
      },
      "thumb-north": {
        top: "p",
        left: "f",
        right: "h",
        bottom: "d",
        center: "",
      },
      "thumb-south": {
        top: "?",
        left: "M2",
        right: "win",
        bottom: "esc",
        center: "",
      },
    },
  },
  A2: {
    left: {
      "ring-north": {
        top: "ctrl",
        left: "=",
        right: "`",
        bottom: "|",
        center: "",
      },

      "middle-north": {
        top: "del",
        left: "6",
        right: "4",
        bottom: "5",
        center: "",
      },
      index: {
        top: "bksp",
        left: "3",
        right: "1",
        bottom: "2",
        center: "",
      },
      "middle-south": {
        top: "scroll\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "scroll\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "[",
        right: "",
        bottom: "]",
        center: "",
      },
      "thumb-north": {
        top: "8",
        left: "9",
        right: "7",
        bottom: "0",
        center: "",
      },
      "thumb-south": {
        top: "~",
        left: "win",
        right: "\\",
        bottom: "esc",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "ctrl",
        left: "=",
        right: "?",
        bottom: "",
        center: "",
      },

      "middle-north": {
        top: "tab",
        left: "4",
        right: "6",
        bottom: "5",
        center: "",
      },
      index: {
        top: "enter",
        left: "1",
        right: "3",
        bottom: "2",
        center: "",
      },
      "middle-south": {
        top: "scroll\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "scroll\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "",
        right: "[",
        bottom: "]",
        center: "",
      },
      "thumb-north": {
        top: "8",
        left: "7",
        right: "9",
        bottom: "0",
        center: "",
      },
      "thumb-south": {
        top: "",
        left: "",
        right: "win",
        bottom: "esc",
        center: "",
      },
    },
  },
  A2_shift: {
    left: {
      "ring-north": {
        top: "ctrl",
        left: "+",
        right: "~",
        bottom: "|",
        center: "",
      },

      "middle-north": {
        top: "del",
        left: "^",
        right: "$",
        bottom: "%",
        center: "",
      },
      index: {
        top: "bksp",
        left: "#",
        right: "!",
        bottom: "@",
        center: "",
      },
      "middle-south": {
        top: "",
        left: "\u2190",
        right: "\u2192",
        bottom: "",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "{",
        right: "",
        bottom: "}",
        center: "",
      },
      "thumb-north": {
        top: "*",
        left: "&",
        right: "(",
        bottom: ")",
        center: "",
      },
      "thumb-south": {
        top: "~",
        left: "",
        right: "|",
        bottom: "esc",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "ctrl",
        left: "+",
        right: "?",
        bottom: "",
        center: "",
      },

      "middle-north": {
        top: "tab",
        left: "$",
        right: "^",
        bottom: "%",
        center: "",
      },
      index: {
        top: "enter",
        left: "!",
        right: "#",
        bottom: "@",
        center: "",
      },
      "middle-south": {
        top: "scroll\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "scroll\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "",
        right: "{",
        bottom: "}",
        center: "",
      },
      "thumb-north": {
        top: "*",
        left: "&",
        right: "(",
        bottom: ")",
        center: "",
      },
      "thumb-south": {
        top: "",
        left: "",
        right: "",
        bottom: "esc",
        center: "",
      },
    },
  },
  A1_shift: {
    left: {
      "ring-north": {
        top: "ctrl",
        left: "<",
        right: '"',
        bottom: "U",
        center: "",
      },

      "middle-north": {
        top: "del",
        left: ">",
        right: "I",
        bottom: "O",
        center: "",
      },
      index: {
        top: "bksp",
        left: "space",
        right: "R",
        bottom: "E",
        center: "",
      },
      "middle-south": {
        top: "\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "M0",
        left: "G",
        right: "W",
        bottom: "Z",
        center: "",
      },
      "thumb-north": {
        top: "V",
        left: "M",
        right: "K",
        bottom: "C",
        center: "",
      },
      "thumb-south": {
        top: "_",
        left: "",
        right: "?",
        bottom: "esc",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "ctrl",
        left: "Y",
        right: ":",
        bottom: "S",
        center: "",
      },

      "middle-north": {
        top: "tab",
        left: "L",
        right: "J",
        bottom: "N",
        center: "",
      },
      index: {
        top: "enter",
        left: "A",
        right: "space",
        bottom: "T",
        center: "",
      },
      "middle-south": {
        top: "\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "X",
        left: "B",
        right: "dup",
        bottom: "Q",
        center: "",
      },
      "thumb-north": {
        top: "P",
        left: "F",
        right: "H",
        bottom: "D",
        center: "",
      },
      "thumb-south": {
        top: "?",
        left: "M2",
        right: "",
        bottom: "esc",
        center: "",
      },
    },
  },
  A3: {
    left: {
      "ring-north": {
        top: "ctrl",
        left: "=",
        right: "`",
        bottom: "|",
        center: "",
      },

      "middle-north": {
        top: "del",
        left: "6",
        right: "4",
        bottom: "5",
        center: "",
      },
      index: {
        top: "bksp",
        left: "3",
        right: "1",
        bottom: "2",
        center: "",
      },
      "middle-south": {
        top: "scroll\u2191",
        left: "\u2190",
        right: "\u2192",
        bottom: "scroll\u2193",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "F11",
        left: "",
        right: "F12",
        bottom: "",
        center: "",
      },
      "thumb-north": {
        top: "F8",
        left: "F9",
        right: "F7",
        bottom: "F10",
        center: "",
      },
      "thumb-south": {
        top: "~",
        left: "win",
        right: "\\",
        bottom: "esc",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "ctrl",
        left: "=",
        right: "?",
        bottom: "",
        center: "",
      },

      "middle-north": {
        top: "tab",
        left: "F4",
        right: "F6",
        bottom: "F5",
        center: "",
      },
      index: {
        top: "enter",
        left: "F1",
        right: "F3",
        bottom: "F2",
        center: "",
      },
      "middle-south": {
        top: "",
        left: "",
        right: "",
        bottom: "",
        center: "",
      },
      "ring-south": {
        top: "M\u2191",
        left: "M\u2190",
        right: "M\u2192",
        bottom: "M\u2193",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
      "thumb-middle": {
        top: "F11",
        left: "F12",
        right: "",
        bottom: "",
        center: "",
      },
      "thumb-north": {
        top: "F8",
        left: "F7",
        right: "F9",
        bottom: "F10",
        center: "",
      },
      "thumb-south": {
        top: "",
        left: "",
        right: "win",
        bottom: "esc",
        center: "",
      },
    },
  },
};

export type JoystickDirection = "top" | "left" | "right" | "bottom";

export type JoystickInput = JoystickDirection | "center";

export type Stick = z.infer<typeof v2Stick>;

export type Half = z.infer<typeof v2Half>;

export type Layout = z.infer<typeof v2Layout>;

export type LayoutHistoryData = z.infer<typeof v2LayoutHistoryData>;

export type LayoutData = z.infer<typeof v2LayoutData>;

export type DefaultLayer = keyof z.infer<typeof v2DefaultLayers>;

export type SwitchLocation = z.infer<typeof v2SwitchLocation>;

export const migrateLayoutFromV1 = (v1: v1.Layout): Layout => {
  const keyMap: Record<v1.DefaultLayer, DefaultLayer> = {
    __base: "A1",
    "__num-shift": "A2",
    "__shift-num-shift": "A2_shift",
    __shift: "A1_shift",
  } as const;

  const prep = f.pipe(
    keyMap,
    R.keys,
    A.reduce({} as Partial<Layout>, (acc, key) => ({
      ...acc,
      [keyMap[key]]: v1[key],
    }))
  );

  const merged = defaultMerge<Layout>((v2) => v2Layout.safeParse(v2))(
    defaultLayout,
    { ...v1, ...prep, _apiVersion: 2 }
  );

  if (merged.success) return merged.data;

  throw new Error("Failed to migrate from v1 to v2");
};

export const migrateLayoutDataFromV1 = (b: v1.LayoutData) => {
  if (b?._apiVersion === 1) {
    console.log("Migrating layout data from v1 to v2");
    return f.pipe(
      b.history,
      A.map((historyState) => ({
        ...historyState,
        modifiedOn: new Date().toISOString(),
        state: migrateLayoutFromV1(historyState.state),
      })),
      (history) => ({
        ...b,
        _apiVersion: 2,
        history: [
          ...history.filter((h) => v2LayoutHistoryData.safeParse(h).success),
          {
            index: 0,
            modifiedOn: new Date().toISOString(),
            state: { ...defaultLayout } as Layout,
          },
        ],
        migration: {
          migrated: true,
          meta: "Migrated from v1 to v2",
        },
      }),
      (value) => {
        console.log(value);
        return value;
      },
      v2LayoutData.safeParse
    );
  }

  return v2LayoutData.safeParse({
    _apiVersion: 2,
    history: [
      {
        index: 0,
        modifiedOn: new Date().toISOString(),
        state: { ...defaultLayout } as Layout,
      },
    ] as LayoutData["history"],
    createdOn: new Date().toISOString(),
    createdBy: "default",
    name: "default",
    migration: {
      migrated: false,
      meta: "No migration needed",
    },
  });
};

export const mergeLayoutData = (
  a: LayoutData,
  b: v1.LayoutData | LayoutData
): z.SafeParseReturnType<LayoutData, LayoutData> => {
  const parsedB = v2LayoutData.safeParse(b);

  if (parsedB.success) {
    return defaultMerge<LayoutData>(v2LayoutData.safeParse)(a, parsedB.data);
  } else {
    if (b._apiVersion === 1) {
      const migrated = migrateLayoutDataFromV1(b);

      if (migrated.success) {
        return defaultMerge<LayoutData>(v2LayoutData.safeParse)(
          a,
          migrated.data
        );
      }
    }

    console.log("Failed to merge layout data b, returning a", { a, b });
    return v2LayoutData.safeParse(a);
  }
};
