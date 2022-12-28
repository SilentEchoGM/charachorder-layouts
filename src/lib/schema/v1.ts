import { z } from "zod";

export const v1Joystick = z.object({
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

export const v1Stick = z.enum(sticks);

export const v1Half = z.object({
  "ring-north": v1Joystick,
  "middle-north": v1Joystick,
  index: v1Joystick,
  "thumb-north": v1Joystick,
  "thumb-middle": v1Joystick,
  "thumb-south": v1Joystick,
  "middle-south": v1Joystick,
  "ring-south": v1Joystick,
  pinky: v1Joystick,
});

export const v1Both = z.object({
  left: v1Half,
  right: v1Half,
});

export const v1DefaultLayers = z.union([
  z.literal("__base"),
  z.literal("__shift"),
  z.literal("__num-shift"),
  z.literal("__shift-num-shift"),
]);

export const v1Layout = z.record(v1DefaultLayers, v1Both);

export const v1LayoutData = z.object({
  _apiVersion: z.literal(1),
  createdBy: z.string(),
  createdOn: z.date(),
  name: z.string(),
  history: z.array(
    z.object({
      modifiedOn: z.date(),
      state: v1Layout,
      index: z.number(),
    })
  ),
});

export const defaultLayout: Layout = {
  __base: {
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
        left: "num-shift",
        right: "shift",
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
        left: "M1",
        right: "win",
        bottom: "esc",
        center: "",
      },
    },
  },
  "__num-shift": {
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
        left: "num-shift",
        right: "shift",
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
  "__shift-num-shift": {
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
        left: "num-shift",
        right: "shift",
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
  __shift: {
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
        left: "num-shift",
        right: "shift",
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
        left: "M1",
        right: "",
        bottom: "esc",
        center: "",
      },
    },
  },
};

//unicode left arrow
export type JoystickDirection = "top" | "left" | "right" | "bottom";

export type JoystickInput = JoystickDirection | "center";

export type Stick = z.infer<typeof v1Stick>;

export type Half = z.infer<typeof v1Half>;

export type Layout = z.infer<typeof v1Layout>;

export type LayoutData = z.infer<typeof v1LayoutData>;

export type DefaultLayer = z.infer<typeof v1DefaultLayers>;
