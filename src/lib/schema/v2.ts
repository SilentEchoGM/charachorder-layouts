import { defaultMerge } from "$lib/utils";
import { z } from "zod";
import type { v1 } from "./v1";

import { array as A, record as R, function as f } from "fp-ts";

import { ord as Ord } from "fp-ts";

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
  half: z.enum(["left", "right"]),
  stick: v2Stick,
  input: z.enum(["top", "left", "right", "bottom", "center"]),
});

export const defaultLayout: Layout = {
  A1: {
    left: {
      "ring-north": {
        top: "LEFT_CTRL",
        left: ",",
        right: "'",
        bottom: "u",
        center: "LH_RING_1_3D",
      },
      "middle-north": {
        top: "DEL",
        left: ".",
        right: "i",
        bottom: "o",
        center: "LH_MID_1_3D",
      },
      index: {
        top: "BKSP",
        left: "SPACE",
        right: "r",
        bottom: "e",
        center: "LH_INDEX_3D",
      },
      "thumb-north": {
        top: "v",
        left: "m",
        right: "k",
        bottom: "c",
        center: "LH_THUMB_1_3D",
      },
      "thumb-middle": {
        top: "MS_CLICK_LF",
        left: "g",
        right: "w",
        bottom: "z",
        center: "LH_THUMB_2_3D",
      },
      "thumb-south": {
        top: "-",
        left: "LEFT_GUI",
        right: "/",
        bottom: "ESC",
        center: "LH_THUMB_3_3D",
      },
      "middle-south": {
        top: "ARROW_UP",
        left: "ARROW_LF",
        right: "ARROW_RT",
        bottom: "ARROW_DN",
        center: "LH_MID_2_3D",
      },
      "ring-south": {
        top: "MS_MOVE_UP",
        left: "MS_MOVE_LF",
        right: "MS_MOVE_RT",
        bottom: "MS_MOVE_DN",
        center: "LH_RING_2_3D",
      },
      pinky: {
        top: "LEFT_ALT",
        left: "KM_2_L",
        right: "LEFT_SHIFT",
        bottom: "AMBILEFT",
        center: "KM_3_L",
      },
    },
    right: {
      "ring-north": {
        top: "RIGHT_CTRL",
        left: "y",
        right: ";",
        bottom: "s",
        center: "RH_RING_1_3D",
      },
      "middle-north": {
        top: "TAB",
        left: "l",
        right: "j",
        bottom: "n",
        center: "RH_MID_1_3D",
      },
      index: {
        top: "ENTER",
        left: "a",
        right: "SPACERIGHT",
        bottom: "t",
        center: "RH_INDEX_3D",
      },
      "thumb-north": {
        top: "p",
        left: "f",
        right: "h",
        bottom: "d",
        center: "RH_THUMB_1_3D",
      },
      "thumb-middle": {
        top: "x",
        left: "b",
        right: "DUP",
        bottom: "q",
        center: "RH_THUMB_2_3D",
      },
      "thumb-south": {
        top: "?",
        left: "MS_CLICK_RT",
        right: "RIGHT_GUI",
        bottom: "ESC",
        center: "RH_THUMB_3_3D",
      },
      "middle-south": {
        top: "ARROW_UP",
        left: "ARROW_LF",
        right: "ARROW_RT",
        bottom: "ARROW_DN",
        center: "RH_MID_2_3D",
      },
      "ring-south": {
        top: "MS_MOVE_UP",
        left: "MS_MOVE_LF",
        right: "MS_MOVE_RT",
        bottom: "MS_MOVE_DN",
        center: "RH_RING_2_3D",
      },
      pinky: {
        top: "RIGHT_ALT",
        left: "RIGHT_SHIFT",
        right: "KM_2_R",
        bottom: "AMBIRIGHT",
        center: "KM_3_R",
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
      "thumb-north": {
        top: "V",
        left: "M",
        right: "K",
        bottom: "C",
        center: "",
      },
      "thumb-middle": {
        top: "M0",
        left: "G",
        right: "W",
        bottom: "Z",
        center: "",
      },
      "thumb-south": {
        top: "_",
        left: "",
        right: "?",
        bottom: "esc",
        center: "",
      },
      "middle-south": {
        top: "↑",
        left: "←",
        right: "→",
        bottom: "↓",
        center: "",
      },
      "ring-south": {
        top: "M↑",
        left: "M←",
        right: "M→",
        bottom: "M↓",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
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
      "thumb-north": {
        top: "P",
        left: "F",
        right: "H",
        bottom: "D",
        center: "",
      },
      "thumb-middle": {
        top: "X",
        left: "B",
        right: "dup",
        bottom: "Q",
        center: "",
      },
      "thumb-south": {
        top: "?",
        left: "M2",
        right: "",
        bottom: "esc",
        center: "",
      },
      "middle-south": {
        top: "↑",
        left: "←",
        right: "→",
        bottom: "↓",
        center: "",
      },
      "ring-south": {
        top: "M↑",
        left: "M←",
        right: "M→",
        bottom: "M↓",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
    },
  },
  A2: {
    left: {
      "ring-north": {
        top: "LEFT_CTRL",
        left: "=",
        right: "`",
        bottom: "|",
        center: "",
      },
      "middle-north": {
        top: "DEL",
        left: "6",
        right: "4",
        bottom: "5",
        center: "",
      },
      index: {
        top: "BKSP",
        left: "3",
        right: "1",
        bottom: "2",
        center: "",
      },
      "thumb-north": {
        top: "8",
        left: "9",
        right: "7",
        bottom: "0",
        center: "",
      },
      "thumb-middle": {
        top: "MS_CLICK_LF",
        left: "[",
        right: "w",
        bottom: "]",
        center: "",
      },
      "thumb-south": {
        top: "-",
        left: "LEFT_GUI",
        right: "\\",
        bottom: "ESC",
        center: "",
      },
      "middle-south": {
        top: "MS_SCRL_UP",
        left: "MS_SCRL_LF",
        right: "MS_SCRL_RT",
        bottom: "MS_SCRL_DN",
        center: "",
      },
      "ring-south": {
        top: "MS_MOVE_UP",
        left: "MS_MOVE_LF",
        right: "MS_MOVE_RT",
        bottom: "MS_MOVE_DN",
        center: "",
      },
      pinky: {
        top: "LEFT_ALT",
        left: "KM_2_L",
        right: "LEFT_SHIFT",
        bottom: "AMBILEFT",
        center: "",
      },
    },
    right: {
      "ring-north": {
        top: "RIGHT_CTRL",
        left: "=",
        right: ";",
        bottom: "s",
        center: "",
      },
      "middle-north": {
        top: "TAB",
        left: "4",
        right: "6",
        bottom: "5",
        center: "",
      },
      index: {
        top: "ENTER",
        left: "1",
        right: "3",
        bottom: "2",
        center: "",
      },
      "thumb-north": {
        top: "8",
        left: "7",
        right: "9",
        bottom: "0",
        center: "",
      },
      "thumb-middle": {
        top: "x",
        left: "b",
        right: "[",
        bottom: "]",
        center: "",
      },
      "thumb-south": {
        top: "?",
        left: "MS_CLICK_RT",
        right: "RIGHT_GUI",
        bottom: "ESC",
        center: "",
      },
      "middle-south": {
        top: "MS_SCRL_UP",
        left: "MS_SCRL_LF",
        right: "MS_SCRL_RT",
        bottom: "MS_SCRL_DN",
        center: "",
      },
      "ring-south": {
        top: "MS_MOVE_UP",
        left: "MS_MOVE_LF",
        right: "MS_MOVE_RT",
        bottom: "MS_MOVE_DN",
        center: "",
      },
      pinky: {
        top: "RIGHT_ALT",
        left: "RIGHT_SHIFT",
        right: "KM_2_R",
        bottom: "AMBIRIGHT",
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
      "thumb-north": {
        top: "*",
        left: "&",
        right: "(",
        bottom: ")",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "{",
        right: "",
        bottom: "}",
        center: "",
      },
      "thumb-south": {
        top: "~",
        left: "",
        right: "|",
        bottom: "esc",
        center: "",
      },
      "middle-south": {
        top: "",
        left: "←",
        right: "→",
        bottom: "",
        center: "",
      },
      "ring-south": {
        top: "M↑",
        left: "M←",
        right: "M→",
        bottom: "M↓",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "num-shift",
        right: "shift",
        bottom: "mirror",
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
      "thumb-north": {
        top: "*",
        left: "&",
        right: "(",
        bottom: ")",
        center: "",
      },
      "thumb-middle": {
        top: "",
        left: "",
        right: "{",
        bottom: "}",
        center: "",
      },
      "thumb-south": {
        top: "",
        left: "",
        right: "",
        bottom: "esc",
        center: "",
      },
      "middle-south": {
        top: "scroll↑",
        left: "←",
        right: "→",
        bottom: "scroll↓",
        center: "",
      },
      "ring-south": {
        top: "M↑",
        left: "M←",
        right: "M→",
        bottom: "M↓",
        center: "",
      },
      pinky: {
        top: "alt",
        left: "shift",
        right: "num-shift",
        bottom: "mirror",
        center: "",
      },
    },
  },
  A3: {
    left: {
      "ring-north": {
        top: "LEFT_CTRL",
        left: ",",
        right: "'",
        bottom: "u",
        center: "",
      },
      "middle-north": {
        top: "DEL",
        left: "F6",
        right: "F4",
        bottom: "F5",
        center: "",
      },
      index: {
        top: "BKSP",
        left: "F3",
        right: "F1",
        bottom: "F2",
        center: "",
      },
      "thumb-north": {
        top: "F8",
        left: "F9",
        right: "F7",
        bottom: "F10",
        center: "",
      },
      "thumb-middle": {
        top: "F11",
        left: "F12",
        right: "w",
        bottom: "z",
        center: "",
      },
      "thumb-south": {
        top: "-",
        left: "LEFT_GUI",
        right: "/",
        bottom: "ESC",
        center: "",
      },
      "middle-south": {
        top: "ARROW_UP",
        left: "ARROW_LF",
        right: "ARROW_RT",
        bottom: "ARROW_DN",
        center: "",
      },
      "ring-south": {
        top: "MS_SCRL_UP",
        left: "MS_SCRL_LF",
        right: "MS_SCRL_RT",
        bottom: "MS_SCRL_DN",
        center: "",
      },
      pinky: {
        top: "LEFT_ALT",
        left: "",
        right: "LEFT_SHIFT",
        bottom: "AMBILEFT",
        center: "KM_3_L",
      },
    },
    right: {
      "ring-north": {
        top: "RIGHT_CTRL",
        left: "y",
        right: ";",
        bottom: "s",
        center: "",
      },
      "middle-north": {
        top: "TAB",
        left: "F4",
        right: "F6",
        bottom: "F5",
        center: "",
      },
      index: {
        top: "ENTER",
        left: "F1",
        right: "F3",
        bottom: "F2",
        center: "",
      },
      "thumb-north": {
        top: "F8",
        left: "F7",
        right: "F9",
        bottom: "F10",
        center: "",
      },
      "thumb-middle": {
        top: "F11",
        left: "b",
        right: "F12",
        bottom: "q",
        center: "",
      },
      "thumb-south": {
        top: "?",
        left: "MS_CLICK_RT",
        right: "RIGHT_GUI",
        bottom: "ESC",
        center: "",
      },
      "middle-south": {
        top: "ARROW_UP",
        left: "ARROW_LF",
        right: "ARROW_RT",
        bottom: "ARROW_DN",
        center: "",
      },
      "ring-south": {
        top: "MS_SCRL_UP",
        left: "MS_SCRL_LF",
        right: "MS_SCRL_RT",
        bottom: "MS_SCRL_DN",
        center: "",
      },
      pinky: {
        top: "RIGHT_ALT",
        left: "RIGHT_SHIFT",
        right: "",
        bottom: "AMBIRIGHT",
        center: "KM_3_R",
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

  console.log("migration prep", { prep, v1 });
  const merged = defaultMerge<Layout>((v2) => v2Layout.safeParse(v2))(
    defaultLayout,
    { ...prep, _apiVersion: 2 }
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
          ...f.pipe(
            history,
            A.filter((h) => v2LayoutHistoryData.safeParse(h).success),
            (arr) =>
              arr.length > 0
                ? arr
                : [
                    {
                      index: 0,
                      modifiedOn: new Date().toISOString(),
                      state: { ...defaultLayout } as Layout,
                    },
                  ]
          ),
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
      migrated: true,
      meta: "No migration performed",
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

export const mapLayoutWithPath =
  (
    fn: (
      value: string,
      path: { layer: DefaultLayer } & SwitchLocation
    ) => string
  ) =>
  (layout: Layout): Layout =>
    f.pipe(
      layout,
      R.mapWithIndex((layer: DefaultLayer, a) =>
        f.pipe(
          a,
          R.mapWithIndex((half, b) =>
            f.pipe(
              b,
              R.mapWithIndex((stick, c) =>
                f.pipe(
                  c,
                  R.mapWithIndex((input, value) =>
                    fn(value, { layer, half, stick, input })
                  )
                )
              )
            )
          )
        )
      )
    );

export const mapLayout =
  (fn: (value: string) => string) =>
  (layout: Layout): Layout =>
    mapLayoutWithPath((value) => fn(value))(layout);

type SwitchValueWithPath = {
  layer: DefaultLayer;
  value: string;
} & SwitchLocation;

export const layoutToArray = (layout: Layout) =>
  f.pipe(
    layout,
    R.reduceWithIndex(Ord.trivial)(
      [] as SwitchValueWithPath[][][][],
      (layer: DefaultLayer, acc, a) => [
        ...acc,
        f.pipe(
          a,
          R.reduceWithIndex(Ord.trivial)(
            [] as SwitchValueWithPath[][][],
            (half, acc, b) => [
              ...acc,
              f.pipe(
                b,
                R.reduceWithIndex(Ord.trivial)(
                  [] as SwitchValueWithPath[][],
                  (stick, acc, c) => [
                    ...acc,
                    f.pipe(
                      c,
                      R.reduceWithIndex(Ord.trivial)(
                        [] as SwitchValueWithPath[],
                        (input, acc, value) => [
                          ...acc,
                          {
                            layer,
                            half,
                            stick,
                            input,
                            value,
                          },
                        ]
                      )
                    ),
                  ]
                )
              ),
            ]
          )
        ),
      ]
    ),
    A.flatten,
    A.flatten,
    A.flatten
  );

export const getSwitchValueByLocation =
  (location: { layer: DefaultLayer } & SwitchLocation) => (layout: Layout) =>
    layout[location.layer][location.half][location.stick][location.input];
