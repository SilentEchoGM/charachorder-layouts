import { randomUUID } from "crypto";
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
import { default as fs } from "fs-extra";
import type { marked } from "marked";
import { Lexer } from "marked";
import { createMarkdownObjectTable } from "parse-markdown-table";
import path from "path";
const raw = fs.readFileSync("static/data/SerialAPI.md", "utf8");

const parsed = new Lexer().lex(raw);

type TextToken = marked.Token & { type: "text" };
const isTextToken = (x: marked.Token): x is TextToken => "text" in x;
const saveJson = (path: string) => (x: unknown) => {
  fs.ensureFileSync(path);
  fs.writeJSONSync(path, x, { spaces: 2 });
};
const trace = <T>(value: T): T => {
  console.log(value);
  return value;
};
const parseTable = (header: string) =>
  f.pipe(
    parsed,
    A.dropLeftWhile((x) => !isTextToken(x) || !x.text.includes(header)),
    A.findFirst(({ type }) => type === "table"),
    E.fromOption(() => new Error("No table found")),
    TE.fromEither,
    TE.chain(({ raw }) => {
      const result = createMarkdownObjectTable(raw);

      return TE.tryCatch(
        () =>
          new Promise(async (resolve) => {
            const rows: any[] = [];
            for await (const row of await result) {
              rows.push(row);
            }
            resolve(rows);
          }),
        E.toError
      );
    }),
    TE.foldW(
      (e) => {
        console.error(e);
        return T.of(undefined);
      },
      (x) => {
        const out = path.join("out", header + ".json");
        saveJson(out)(x);
        return T.of(undefined);
      }
    )
  );

const targets = [
  "ALPHA dictionary",
  "NUMS dictionary",
  "CC Function Codes",
  "Config Variables",
  "Notes and NoteIds",
];

const main = f.pipe(targets, A.map(parseTable), T.sequenceArray)();
