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

const saveJson = (path: string) => (x: unknown) => {
  fs.ensureFileSync(path);
  fs.writeJSONSync(path, x, { spaces: 2 });
};
const trace = <T>(value: T): T => {
  console.log(value);
  return value;
};

const defaultLayoutPath = "./reference/defaultLayout.csv";

const defaultLayout = f.pipe(
  fs.readFileSync(defaultLayoutPath, "utf8"),
  (str) => str.split("\n"),
  RA.map((str) => str.split(",")),
  RA.map(([layer, switchInput, value]) => ({
    layer,
    switchInput,
    value,
  })),
  saveJson("./static/data/defaultLayout.json")
);
