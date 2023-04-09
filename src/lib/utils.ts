import { compareTwoStrings } from "string-similarity";
import { default as merge } from "ts-deepmerge";
import type { z } from "zod";
import type { LayoutData } from "./schema/v2";

import { option as O } from "fp-ts";

type IObject = Record<string, any>;

export const defaultMerge =
  <T extends IObject>(guard: (obj: any) => z.SafeParseReturnType<T, T>) =>
  (a: T, b: any): z.SafeParseReturnType<T, T> => {
    if (typeof b === "object") {
      const merged = merge(a, b);
      const parsed = guard(merged);
      if (parsed.success) {
        return parsed;
      } else {
        console.error("Invalid type for merge", { a, b, merged, parsed });
      }
    }
    return guard(a);
  };

export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const mCompareTwoStrings = memoize(compareTwoStrings);

export const getLatest = (layout: LayoutData) => {
  if (layout.history.length === 0) return O.none;
  return O.some(layout.history[layout.history.length - 1]);
};
