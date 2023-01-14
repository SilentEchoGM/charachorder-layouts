import { getSwitchInputLocation } from "$lib/data/switches";
import {
  defaultLayout,
  v2Both,
  v2DefaultLayers,
  v2Half,
  v2Layout,
  type Layout,
} from "$lib/schema/v2";
import { defaultMerge } from "$lib/utils";

import { function as f, readonlyArray as RA } from "fp-ts";
import type { z } from "zod";

export const parseDotIoImportCSV = (
  csv: string
): z.SafeParseReturnType<Layout, Layout> =>
  f.pipe(
    csv,
    (str) => str.split("\n"),
    RA.map((str) => str.split(",")),
    RA.reduce(defaultLayout, (acc, [layer, switchInput, value]) => {
      const { hand, stick, input } = getSwitchInputLocation(
        parseInt(switchInput)
      );
      const parsedLayer = v2DefaultLayers.keyof().safeParse(layer);
      const parsedHand = v2Both.keyof().safeParse(hand);
      const parsedStick = v2Half.keyof().safeParse(stick);
      if (!parsedLayer.success || !parsedHand.success || !parsedStick.success) {
        throw new Error(
          `Failed to parse layer ${layer} hand ${hand} stick ${stick}`
        );
      }

      return {
        ...acc,
        [parsedLayer.data]: {
          ...acc[parsedLayer.data],
          [hand]: {
            ...acc[parsedLayer.data][parsedHand.data],
            [stick]: {
              ...acc[parsedLayer.data][parsedHand.data][parsedStick.data],
              [input]: value,
            },
          },
        },
      };
    }),
    v2Layout.safeParse
  );
