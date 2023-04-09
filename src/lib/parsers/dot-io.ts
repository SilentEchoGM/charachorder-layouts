import { getCodeFromUTF8, getUTF8FromCode } from "$lib/data/ccosCodeIds";
import { getSwitchInputLocation, getSwitchNumber } from "$lib/data/switches";
import {
  defaultLayout,
  v2Both,
  v2DefaultLayers,
  v2Half,
  v2Layout,
  type DefaultLayer,
  type Layout,
  type SwitchLocation,
} from "$lib/schema/v2";

import {
  ord as Ord,
  record as R,
  readonlyArray as RA,
  function as f,
} from "fp-ts";

import type { z } from "zod";

const getCSVEntry = ({
  layer,
  half,
  stick,
  input,
  value,
}: SwitchLocation & {
  layer: DefaultLayer;
  value: string;
}) =>
  `${layer},${getSwitchNumber({
    half,
    stick,
    input,
  })},${getCodeFromUTF8(value)}`;

export const parseDotIoImportCSV = (
  csv: string
): z.SafeParseReturnType<Layout, Layout> =>
  f.pipe(
    csv.trim(),
    (str) => str.split("\n"),
    RA.map((str) => str.split(",")),
    RA.reduce(defaultLayout, (acc, [layer, switchInput, value]) => {
      console.log("Parsing", layer, switchInput, value);
      const { half, stick, input } = getSwitchInputLocation(
        parseInt(switchInput)
      );
      const parsedLayer = v2DefaultLayers.keyof().safeParse(layer);
      const parsedHand = v2Both.keyof().safeParse(half);
      const parsedStick = v2Half.keyof().safeParse(stick);
      if (!parsedLayer.success || !parsedHand.success || !parsedStick.success) {
        throw new Error(
          `Failed to parse layer ${layer} half ${half} stick ${stick}`
        );
      }

      const utf8 = getUTF8FromCode(parseInt(value));

      console.log("Converted", value, "to", utf8);

      return {
        ...acc,
        [parsedLayer.data]: {
          ...acc[parsedLayer.data],
          [half]: {
            ...acc[parsedLayer.data][parsedHand.data],
            [stick]: {
              ...acc[parsedLayer.data][parsedHand.data][parsedStick.data],
              [input]: getUTF8FromCode(parseInt(value)),
            },
          },
        },
      };
    }),
    v2Layout.safeParse
  );

const collect = <A extends Record<string, string>>(a: A) =>
  f.pipe(
    a,
    R.collect(Ord.trivial)((_, b) => b)
  );

export const exportDotIoCSV = (layout: Layout) =>
  f.pipe(
    layout,
    R.filterWithIndex((key, _) => !key.includes("shift")),
    R.mapWithIndex((layerName: keyof Layout, layer) =>
      f.pipe(
        layer,
        R.mapWithIndex((hand: keyof typeof layer, half) =>
          f.pipe(
            half,
            R.mapWithIndex((stickName: keyof typeof half, stick) =>
              f.pipe(
                stick,
                R.mapWithIndex((input: keyof typeof stick, value) =>
                  getCSVEntry({
                    layer: layerName,
                    half: hand,
                    stick: stickName,
                    input,
                    value,
                  })
                ),
                collect,
                (str) => str.join("\n")
              )
            ),
            collect,
            (str) => str.join("\n")
          )
        ),
        collect,
        (str) => str.join("\n")
      )
    ),
    collect,
    (str) => str.join("\n")
  );
