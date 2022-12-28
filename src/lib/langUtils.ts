import { isLanguage, langMap, type Language } from "./data/languages";
import {
  defaultLayout,
  v1Layout,
  type DefaultLayer,
  type Layout,
} from "./schema/v1";

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

const fixedDefaults = [
  "ctrl",
  "alt",
  "shift",
  "win",
  "bksp",
  "del",
  "space",
  "M0",
  "M1",
  "esc",
];
export const parseLanguage = (language: Language): Layout => {
  if (!isLanguage(language)) {
    throw new Error(`Language ${language} not supported`);
  }
  const trace =
    (message: string) =>
    <T>(value: T): T => {
      console.log(message, value);
      return value;
    };
  const layout = f.pipe(
    defaultLayout,
    R.mapWithIndex((layer: DefaultLayer, value) =>
      f.pipe(
        value,
        R.map((value) =>
          f.pipe(
            value,
            R.map((value) =>
              f.pipe(
                value,
                R.map((value) => {
                  switch (layer) {
                    case "__base":
                      return langMap[language][value] ?? value ?? "";

                    case "__shift":
                      return (
                        langMap[language]["Shift + " + value.toLowerCase()] ??
                        value ??
                        ""
                      );
                    case "__num-shift":
                      return (
                        langMap[language][value.toLowerCase()] ?? value ?? ""
                      );

                    case "__shift-num-shift":
                      return (
                        langMap[language]["Shift + " + value.toLowerCase()] ??
                        value ??
                        ""
                      );
                  }
                })
              )
            )
          )
        )
      )
    ),
    v1Layout.safeParse
  );

  if (layout.success) {
    return layout.data;
  }
  console.log();
  throw new Error("Layout not valid" + layout.error);
};
