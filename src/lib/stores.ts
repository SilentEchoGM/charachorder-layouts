import { writable } from "svelte/store";
import type { JoystickInput, Stick } from "./schema/v2";

export const editModal = writable<{
  hand: "left" | "right";
  stick: Stick;
  input: JoystickInput;
  open: boolean;
  value: string;
}>({
  hand: "left",
  stick: "index",
  input: "bottom",
  open: false,
  value: "",
});
