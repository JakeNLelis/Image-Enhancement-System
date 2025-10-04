import { MembershipFunction, LinguisticVariable } from "@/types/fuzzy";

export function evaluateTriangular(
  x: number,
  points: [number, number, number]
): number {
  const [a, b, c] = points;
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

export function evaluateTrapezoidal(
  x: number,
  points: [number, number, number, number]
): number {
  const [a, b, c, d] = points;
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

export function evaluateMembershipFunction(
  x: number,
  mf: MembershipFunction
): number {
  switch (mf.type) {
    case "triangular":
      return evaluateTriangular(x, mf.points);
    case "trapezoidal":
      return evaluateTrapezoidal(x, mf.points);
    default:
      return 0;
  }
}

export const brightnessVariable: LinguisticVariable = {
  name: "brightness",
  universe: [0, 255],
  terms: {
    VeryDark: { type: "trapezoidal", points: [0, 0, 40, 80] },
    Dark: { type: "triangular", points: [40, 80, 120] },
    Normal: { type: "triangular", points: [80, 127, 175] },
    Bright: { type: "triangular", points: [135, 175, 215] },
    VeryBright: { type: "trapezoidal", points: [175, 215, 255, 255] },
  },
};

export const contrastVariable: LinguisticVariable = {
  name: "contrast",
  universe: [0, 100],
  terms: {
    VeryLow: { type: "trapezoidal", points: [0, 0, 15, 25] },
    Low: { type: "triangular", points: [15, 25, 40] },
    Medium: { type: "triangular", points: [30, 50, 70] },
    High: { type: "triangular", points: [60, 75, 90] },
    VeryHigh: { type: "trapezoidal", points: [80, 90, 100, 100] },
  },
};

export const sharpnessVariable: LinguisticVariable = {
  name: "sharpness",
  universe: [0, 100],
  terms: {
    VeryBlurry: { type: "trapezoidal", points: [0, 0, 15, 30] },
    Blurry: { type: "triangular", points: [15, 30, 50] },
    Acceptable: { type: "triangular", points: [40, 55, 70] },
    Sharp: { type: "triangular", points: [60, 75, 90] },
    VerySharp: { type: "trapezoidal", points: [80, 90, 100, 100] },
  },
};

export const noiseVariable: LinguisticVariable = {
  name: "noise",
  universe: [0, 100],
  terms: {
    Clean: { type: "trapezoidal", points: [0, 0, 10, 25] },
    Slight: { type: "triangular", points: [15, 30, 50] },
    Moderate: { type: "triangular", points: [40, 60, 80] },
    Heavy: { type: "trapezoidal", points: [70, 85, 100, 100] },
  },
};

export const brightnessAdjVariable: LinguisticVariable = {
  name: "brightnessAdj",
  universe: [-100, 100],
  terms: {
    LargeDecrease: { type: "trapezoidal", points: [-100, -100, -80, -60] },
    SmallDecrease: { type: "triangular", points: [-70, -40, -15] },
    NoChange: { type: "triangular", points: [-20, 0, 20] },
    SmallIncrease: { type: "triangular", points: [15, 40, 70] },
    LargeIncrease: { type: "trapezoidal", points: [60, 80, 100, 100] },
  },
};

export const contrastAdjVariable: LinguisticVariable = {
  name: "contrastAdj",
  universe: [0.5, 2.0],
  terms: {
    LargeDecrease: { type: "trapezoidal", points: [0.5, 0.5, 0.6, 0.7] },
    SmallDecrease: { type: "triangular", points: [0.7, 0.8, 0.9] },
    NoChange: { type: "triangular", points: [0.9, 1.0, 1.1] },
    SmallIncrease: { type: "triangular", points: [1.1, 1.3, 1.5] },
    LargeIncrease: { type: "trapezoidal", points: [1.5, 1.7, 2.0, 2.0] },
  },
};

export const sharpenVariable: LinguisticVariable = {
  name: "sharpen",
  universe: [0, 100],
  terms: {
    None: { type: "trapezoidal", points: [0, 0, 5, 15] },
    Low: { type: "triangular", points: [10, 20, 35] },
    Medium: { type: "triangular", points: [30, 45, 65] },
    High: { type: "triangular", points: [60, 75, 90] },
    VeryHigh: { type: "trapezoidal", points: [85, 92, 100, 100] },
  },
};

export const denoiseVariable: LinguisticVariable = {
  name: "denoise",
  universe: [0, 100],
  terms: {
    None: { type: "trapezoidal", points: [0, 0, 5, 15] },
    Low: { type: "triangular", points: [10, 25, 40] },
    Medium: { type: "triangular", points: [35, 50, 70] },
    High: { type: "triangular", points: [65, 80, 95] },
    VeryHigh: { type: "trapezoidal", points: [90, 95, 100, 100] },
  },
};

export const inputVariables = {
  brightness: brightnessVariable,
  contrast: contrastVariable,
  sharpness: sharpnessVariable,
  noise: noiseVariable,
};

export const outputVariables = {
  brightnessAdj: brightnessAdjVariable,
  contrastAdj: contrastAdjVariable,
  sharpen: sharpenVariable,
  denoise: denoiseVariable,
};
