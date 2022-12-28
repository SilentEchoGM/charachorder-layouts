import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

const { set, subscribe } = { ...writable({ x: 0, y: 0 }) };

if (browser)
  document.addEventListener("mousemove", (e) => {
    set({ x: e.clientX, y: e.clientY });
  });

const check = (node: HTMLElement) => {
  const { x, y } = get({ subscribe });
  const { top, left, bottom, right } = node.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
};

export const mousePosition = { subscribe, check };
