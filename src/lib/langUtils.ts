import { isLanguage, langMap, type Language } from "./data/languages";
import {
  defaultLayout,
  v1Layout,
  type DefaultLayer,
  type Layout,
} from "./schema/v1";

import { function as f, record as R } from "fp-ts";

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
