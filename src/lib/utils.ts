import { default as merge } from "ts-deepmerge";
import type { z } from "zod";

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
