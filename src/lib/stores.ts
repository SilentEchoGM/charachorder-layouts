import { writable } from "svelte/store";
import type { JoystickInput, Stick } from "./schema/v1";

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
