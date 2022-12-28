import { function as f } from "fp-ts";

export const to =
  (action: "m" | "l") =>
  (x: number, y: number, rel = true) =>
  (str = "") =>
    `${str.length ? str + "\n" : str}${action[
      rel ? "toLowerCase" : "toUpperCase"
    ]()}${x} ${y}`;

export const moveTo = to("m");
export const lineTo = to("l");

export const arc =
  (
    rx: number,
    ry: number,
    xRot: number,
    largeArc: boolean,
    sweep: boolean,
    x: number,
    y: number,
    rel = true
  ) =>
  (str = "") =>
    `${str.length ? str + "\n" : str}${rel ? "a" : "A"}${rx} ${ry} ${xRot} ${
      largeArc ? 1 : 0
    } ${sweep ? 1 : 0} ${x} ${y}`;

export const quarterCircleArc = (radius: number, rel = true) =>
  arc(radius, radius, 0, false, true, radius, radius, rel);

export const simplePythagoras = (a: number, b: number = a) =>
  Math.sqrt(a * a + b * b);

export const segmentVertical =
  (direction: "top" | "bottom" = "top") =>
  (radius: number, rel = true) => {
    return f.pipe(
      moveTo(-simplePythagoras(radius) * 0.5, 0)(),
      arc(
        radius,
        radius,
        0,
        false,
        direction === "top",
        simplePythagoras(radius),
        0,
        rel
      ),
      lineTo(
        -simplePythagoras(radius) * 0.25,
        simplePythagoras(radius) * 0.25 * (direction === "top" ? 1 : -1),
        rel
      ),
      arc(
        radius * 0.5,
        radius * 0.5,
        0,
        false,
        direction === "bottom",
        -simplePythagoras(radius) * 0.5,
        0,
        rel
      )
    );
  };

export const segmentBottom = segmentVertical("bottom");
export const segmentTop = segmentVertical("top");

export const segmentHorizontal =
  (direction: "left" | "right" = "left") =>
  (radius: number, rel = true) =>
    f.pipe(
      moveTo(0, -simplePythagoras(radius) * 0.5)(),

      arc(
        radius,
        radius,
        0,
        false,
        direction === "right",
        0,
        simplePythagoras(radius),

        rel
      ),
      lineTo(
        simplePythagoras(radius) * 0.25 * (direction === "left" ? 1 : -1),
        -simplePythagoras(radius) * 0.25,
        rel
      ),
      arc(
        radius * 0.5,
        radius * 0.5,
        0,
        false,
        direction === "left",
        0,
        -simplePythagoras(radius) * 0.5,
        rel
      )
    );

export const segmentLeft = segmentHorizontal("left");
export const segmentRight = segmentHorizontal("right");
