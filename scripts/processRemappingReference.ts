import { default as fs } from "fs-extra";

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
import { join } from "path";

const saveJson = (path: string) => (x: unknown) => {
  fs.ensureFileSync(path);
  fs.writeJSONSync(path, x, { spaces: 2 });
};
const trace = <T>(value: T): T => {
  console.log(value);
  return value;
};

const filename = "remappingReference.csv";
const path = join("./reference", filename);

const defaultLayout = f.pipe(
  fs.readFileSync(path, "utf8"),
  (str) => str.split("\n"),
  RA.map((str) => str.split(",")),
  RA.map(([byte, ascii, action]) => ({
    byte,
    ascii,
    action,
  })),
  ([_, ...rest]) => rest,
  saveJson(`./static/data/${filename}.json`)
);
