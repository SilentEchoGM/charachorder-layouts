import type { JoystickInput, Stick, SwitchLocation } from "$lib/schema/v2";

import { either as E, function as f, readonlyArray as RA } from "fp-ts";

const stickMap: readonly Stick[] = [
  "thumb-south",
  "thumb-middle",
  "thumb-north",
  "index",
  "middle-north",
  "ring-north",
  "pinky",
  "middle-south",
  "ring-south",
] as const;

const leftHandStickInputMap: readonly JoystickInput[] = [
  "center",
  "right",
  "top",
  "left",
  "bottom",
] as const;

const rightHandStickInputMap: readonly JoystickInput[] = [
  "center",
  "left",
  "top",
  "right",
  "bottom",
] as const;

const isValidSwitchNumber = (num: number): boolean => num >= 0 && num <= 89;

const getSwitchHand = (num: number): E.Either<string, "left" | "right"> =>
  f.pipe(
    num,
    E.fromPredicate(
      isValidSwitchNumber,
      () => `getSwitchHand:invalid switch number: ${num}`
    ),
    E.map((num) => (num < 45 ? "left" : "right"))
  );

const getSwitchStick = (num: number): E.Either<string, Stick> =>
  f.pipe(
    num,
    E.fromPredicate(
      isValidSwitchNumber,

      () => `getSwitchStick:invalid switch number: ${num}`
    ),
    E.chain((num) =>
      E.fromNullable(
        `getSwitchStick:switch not found in stick map: ${
          stickMap[Math.floor((num % 45) / 5)]
        }`
      )(stickMap[Math.floor((num % 45) / 5)])
    )
  );

const getSwitchInput = (num: number) =>
  f.pipe(
    num,
    E.fromPredicate(
      isValidSwitchNumber,
      () => `getSwitchInput:invalid switch number: ${num}`
    ),
    E.chain((num) => getSwitchHand(num)),
    E.chain((half) =>
      E.fromNullable(
        `getSwitchInput:switch not found in input map: ${(num % 45) % 5}`
      )(
        half === "left"
          ? leftHandStickInputMap[(num % 45) % 5]
          : rightHandStickInputMap[(num % 45) % 5]
      )
    )
  );

export const getSwitchInputLocation = (num: number) =>
  f.pipe(
    [getSwitchHand, getSwitchStick, getSwitchInput],
    RA.map((f) => f(num)),
    E.sequenceArray,
    E.map(([half, stick, input]) => ({ half, stick, input })),
    E.getOrElseW((e) => {
      throw new Error(e);
    })
  );

const getStickStartNumber = ({
  stick,
}: SwitchLocation): E.Either<string, number> =>
  f.pipe(
    stickMap,
    RA.findIndex((a) => stick === a),
    E.fromOption(() => `getStickStartNumber:stick not found: ${stick}`),
    E.map((stickNum) => stickNum * 5)
  );

const getHandStartNumber = ({
  half,
}: SwitchLocation): E.Either<string, number> =>
  half === "left" ? E.right(0) : E.right(45);

const getStickInputNumber = ({ input, half }: SwitchLocation) =>
  f.pipe(
    half === "left" ? leftHandStickInputMap : rightHandStickInputMap,
    RA.findIndex((a) => input === a),
    E.fromOption(() => `getStickInputNumber:input not found: ${input}`)
  );

export const getSwitchNumber = (location: SwitchLocation) =>
  f.pipe(
    [getStickStartNumber, getHandStartNumber, getStickInputNumber],
    RA.map((f) => f(location)),
    E.sequenceArray,
    E.map(RA.reduce(0, (a, b) => a + b)),
    E.getOrElseW((e) => {
      throw new Error(e);
    })
  );
