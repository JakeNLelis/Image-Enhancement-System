import {
  ImageMetrics,
  EnhancementParameters,
  FuzzifiedInputs,
  InferenceResult,
  FiredRule,
  ClippedOutput,
  AggregatedOutput,
  Point,
  FuzzyCondition,
  FuzzyConsequent,
} from "@/types/fuzzy";
import {
  inputVariables,
  outputVariables,
  evaluateMembershipFunction,
} from "./membershipFunctions";
import { fuzzyRules } from "./fuzzyRules";

export function fuzzifyInputs(metrics: ImageMetrics): FuzzifiedInputs {
  return {
    brightness: {
      VeryDark: evaluateMembershipFunction(
        metrics.brightness,
        inputVariables.brightness.terms.VeryDark
      ),
      Dark: evaluateMembershipFunction(
        metrics.brightness,
        inputVariables.brightness.terms.Dark
      ),
      Normal: evaluateMembershipFunction(
        metrics.brightness,
        inputVariables.brightness.terms.Normal
      ),
      Bright: evaluateMembershipFunction(
        metrics.brightness,
        inputVariables.brightness.terms.Bright
      ),
      VeryBright: evaluateMembershipFunction(
        metrics.brightness,
        inputVariables.brightness.terms.VeryBright
      ),
    },
    contrast: {
      VeryLow: evaluateMembershipFunction(
        metrics.contrast,
        inputVariables.contrast.terms.VeryLow
      ),
      Low: evaluateMembershipFunction(
        metrics.contrast,
        inputVariables.contrast.terms.Low
      ),
      Medium: evaluateMembershipFunction(
        metrics.contrast,
        inputVariables.contrast.terms.Medium
      ),
      High: evaluateMembershipFunction(
        metrics.contrast,
        inputVariables.contrast.terms.High
      ),
      VeryHigh: evaluateMembershipFunction(
        metrics.contrast,
        inputVariables.contrast.terms.VeryHigh
      ),
    },
    sharpness: {
      VeryBlurry: evaluateMembershipFunction(
        metrics.sharpness,
        inputVariables.sharpness.terms.VeryBlurry
      ),
      Blurry: evaluateMembershipFunction(
        metrics.sharpness,
        inputVariables.sharpness.terms.Blurry
      ),
      Acceptable: evaluateMembershipFunction(
        metrics.sharpness,
        inputVariables.sharpness.terms.Acceptable
      ),
      Sharp: evaluateMembershipFunction(
        metrics.sharpness,
        inputVariables.sharpness.terms.Sharp
      ),
      VerySharp: evaluateMembershipFunction(
        metrics.sharpness,
        inputVariables.sharpness.terms.VerySharp
      ),
    },
    noise: {
      Clean: evaluateMembershipFunction(
        metrics.noise,
        inputVariables.noise.terms.Clean
      ),
      Slight: evaluateMembershipFunction(
        metrics.noise,
        inputVariables.noise.terms.Slight
      ),
      Moderate: evaluateMembershipFunction(
        metrics.noise,
        inputVariables.noise.terms.Moderate
      ),
      Heavy: evaluateMembershipFunction(
        metrics.noise,
        inputVariables.noise.terms.Heavy
      ),
    },
  };
}

function evaluateAntecedent(
  conditions: FuzzyCondition[],
  fuzzifiedInputs: FuzzifiedInputs
): number {
  const membershipValues = conditions.map((condition) => {
    switch (condition.variable) {
      case "brightness":
        return fuzzifiedInputs.brightness[
          condition.term as keyof typeof fuzzifiedInputs.brightness
        ];
      case "contrast":
        return fuzzifiedInputs.contrast[
          condition.term as keyof typeof fuzzifiedInputs.contrast
        ];
      case "sharpness":
        return fuzzifiedInputs.sharpness[
          condition.term as keyof typeof fuzzifiedInputs.sharpness
        ];
      case "noise":
        return fuzzifiedInputs.noise[
          condition.term as keyof typeof fuzzifiedInputs.noise
        ];
      default:
        return 0;
    }
  });

  return Math.min(...membershipValues);
}

function applyImplication(
  consequents: FuzzyConsequent[],
  firingStrength: number
): ClippedOutput[] {
  return consequents.map((consequent) => {
    const outputVar =
      outputVariables[consequent.variable as keyof typeof outputVariables];
    const membershipFunction =
      outputVar.terms[consequent.term as keyof typeof outputVar.terms];

    return {
      variable: consequent.variable,
      term: consequent.term,
      membershipFunction,
      clippingLevel: firingStrength,
    };
  });
}

function aggregateOutputs(firedRules: FiredRule[]): AggregatedOutput[] {
  const outputVars = ["brightnessAdj", "contrastAdj", "sharpen", "denoise"];

  return outputVars.map((variable) => {
    const relevantOutputs = firedRules.flatMap((rule) =>
      rule.outputs.filter((output) => output.variable === variable)
    );

    if (relevantOutputs.length === 0) {
      return {
        variable,
        aggregatedFunction: [],
      };
    }

    const universe =
      outputVariables[variable as keyof typeof outputVariables].universe;
    const step = (universe[1] - universe[0]) / 100;
    const points: Point[] = [];

    for (let x = universe[0]; x <= universe[1]; x += step) {
      let maxMembership = 0;

      for (const output of relevantOutputs) {
        const membership = Math.min(
          evaluateMembershipFunction(x, output.membershipFunction),
          output.clippingLevel
        );
        maxMembership = Math.max(maxMembership, membership);
      }

      points.push({ x, y: maxMembership });
    }

    return {
      variable,
      aggregatedFunction: points,
    };
  });
}

function defuzzifyCentroid(aggregatedFunction: Point[]): number {
  let numerator = 0;
  let denominator = 0;

  for (const point of aggregatedFunction) {
    numerator += point.x * point.y;
    denominator += point.y;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

export function mamdaniInference(metrics: ImageMetrics): InferenceResult {
  const fuzzifiedInputs = fuzzifyInputs(metrics);

  const firedRules: FiredRule[] = [];

  for (const rule of fuzzyRules) {
    const firingStrength = evaluateAntecedent(rule.if, fuzzifiedInputs);

    if (firingStrength > 0) {
      const clippedOutputs = applyImplication(rule.then, firingStrength);
      firedRules.push({
        rule,
        firingStrength,
        outputs: clippedOutputs,
      });
    }
  }

  const aggregatedOutputs = aggregateOutputs(firedRules);

  const crispOutputs: EnhancementParameters = {
    brightnessAdj: 0,
    contrastAdj: 1,
    sharpen: 0,
    denoise: 0,
  };

  for (const output of aggregatedOutputs) {
    const crispValue = defuzzifyCentroid(output.aggregatedFunction);

    switch (output.variable) {
      case "brightnessAdj":
        crispOutputs.brightnessAdj = crispValue;
        break;
      case "contrastAdj":
        crispOutputs.contrastAdj = crispValue;
        break;
      case "sharpen":
        crispOutputs.sharpen = crispValue;
        break;
      case "denoise":
        crispOutputs.denoise = crispValue;
        break;
    }
  }

  return {
    crispOutputs,
    firedRules,
    aggregatedOutputs,
    fuzzifiedInputs,
  };
}
