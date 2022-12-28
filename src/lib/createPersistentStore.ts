import { get, writable } from "svelte/store";

import {
  array as A,
  boolean,
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
  taskEither as TE,
} from "fp-ts";

import { getItem, setItem } from "localforage";
import type { z } from "zod";

export const persistent = <T>(
  key: string,
  defaultValue: T,
  guard: {
    zod?: InstanceType<typeof z.ZodType<T>>["safeParse"];
    generic?: (obj: any) => obj is T;
  }
) => {
  const { set, subscribe } = writable<T>(defaultValue);

  let loaded = false;

  const prefix = "__persistent";
  const save = async (value: T) => {
    if (!loaded) {
      console.warn(
        "Attempted to save before load, will save when store has loaded",
        {
          key,
          value,
          defaultValue,
        }
      );
      load().then(() => save(value));
    }
    if (guard.zod) {
      const parsed = guard.zod(value);
      if (parsed.success) {
        await setItem(prefix + key, parsed.data);
        set(parsed.data);
      } else {
        console.warn("Invalid type for persistent store", {
          key,
          value,
          defaultValue,
        });
      }
    }

    if (guard.generic) {
      if (guard.generic(value)) {
        await setItem(prefix + key, value);
        set(value);
      } else {
        console.warn("Invalid type for persistent store", {
          key,
          value,
          defaultValue,
        });
      }
    }
  };

  const update = async (fn: (value: T) => T) => {
    const $value = get({ subscribe });
    const newValue = fn($value);
    await save(newValue);
  };

  const load = async () => {
    const value = await getItem(prefix + key);
    if (guard.zod) {
      const parsed = guard.zod(value);
      if (parsed.success) {
        set(parsed.data);
        loaded = true;
        return parsed.data;
      } else {
        console.warn(
          "Invalid type for persistent store, resetting to default",
          {
            key,
            parsed,
            defaultValue,
          }
        );
        await save(defaultValue);
        set(defaultValue);
        return defaultValue;
      }
    }
    if (guard.generic) {
      if (guard.generic(value)) {
        set(value);
        loaded = true;
        return value;
      } else {
        console.warn(
          "Invalid type for persistent store, resetting to default",
          {
            key,
            value,
            defaultValue,
          }
        );
        await save(defaultValue);
        set(defaultValue);
        return defaultValue;
      }
    }
  };

  load();

  return {
    subscribe,
    set: save,
    update,
    load,
  };
};
