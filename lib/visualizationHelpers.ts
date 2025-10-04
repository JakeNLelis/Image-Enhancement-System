import {
  MembershipFunctionChart,
  RuleVisualization,
  Point,
} from "@/types/fuzzy";
import {
  inputVariables,
  outputVariables,
  evaluateMembershipFunction,
} from "./membershipFunctions";
import { InferenceResult, ImageMetrics } from "@/types/fuzzy";

export function generateMembershipChartData(
  variableName: string,
  currentValue?: number,
  isOutput: boolean = false
): MembershipFunctionChart {
  const variable = isOutput
    ? outputVariables[variableName as keyof typeof outputVariables]
    : inputVariables[variableName as keyof typeof inputVariables];

  if (!variable) {
    throw new Error(`Variable ${variableName} not found`);
  }

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];
  const functions = Object.entries(variable.terms).map(
    ([termName, mf], index) => {
      const points: Point[] = [];
      const [min, max] = variable.universe;
      const step = (max - min) / 100;

      for (let x = min; x <= max; x += step) {
        points.push({
          x,
          y: evaluateMembershipFunction(x, mf),
        });
      }

      return {
        name: termName,
        points,
        color: colors[index % colors.length],
      };
    }
  );

  return {
    variable: variableName,
    universe: variable.universe,
    functions,
    currentValue,
  };
}

export function generateRuleVisualizationData(
  inferenceResult: InferenceResult
): RuleVisualization[] {
  return inferenceResult.firedRules.map((firedRule) => {
    const { rule, firingStrength } = firedRule;

    const antecedentValues = rule.if.map((condition) => {
      let membershipValue = 0;

      switch (condition.variable) {
        case "brightness":
          membershipValue =
            inferenceResult.fuzzifiedInputs.brightness[
              condition.term as keyof typeof inferenceResult.fuzzifiedInputs.brightness
            ] || 0;
          break;
        case "contrast":
          membershipValue =
            inferenceResult.fuzzifiedInputs.contrast[
              condition.term as keyof typeof inferenceResult.fuzzifiedInputs.contrast
            ] || 0;
          break;
        case "sharpness":
          membershipValue =
            inferenceResult.fuzzifiedInputs.sharpness[
              condition.term as keyof typeof inferenceResult.fuzzifiedInputs.sharpness
            ] || 0;
          break;
        case "noise":
          membershipValue =
            inferenceResult.fuzzifiedInputs.noise[
              condition.term as keyof typeof inferenceResult.fuzzifiedInputs.noise
            ] || 0;
          break;
      }

      return {
        variable: condition.variable,
        term: condition.term,
        membershipValue,
      };
    });

    const consequentTerms = rule.then.map((consequent) => ({
      variable: consequent.variable,
      term: consequent.term,
    }));

    return {
      ruleId: rule.id,
      description: rule.description || `Rule ${rule.id}`,
      firingStrength,
      isActive: firingStrength > 0,
      antecedentValues,
      consequentTerms,
    };
  });
}

export function generateLinguisticInterpretation(
  metrics: ImageMetrics
): string {
  const interpretations: string[] = [];

  if (metrics.brightness < 60) {
    interpretations.push("dark");
  } else if (metrics.brightness > 200) {
    interpretations.push("very bright");
  } else if (metrics.brightness > 160) {
    interpretations.push("bright");
  } else {
    interpretations.push("normal brightness");
  }

  if (metrics.contrast < 20) {
    interpretations.push("very low contrast");
  } else if (metrics.contrast < 40) {
    interpretations.push("low contrast");
  } else if (metrics.contrast > 85) {
    interpretations.push("very high contrast");
  } else if (metrics.contrast > 70) {
    interpretations.push("high contrast");
  } else {
    interpretations.push("medium contrast");
  }

  if (metrics.sharpness < 25) {
    interpretations.push("very blurry");
  } else if (metrics.sharpness < 45) {
    interpretations.push("blurry");
  } else if (metrics.sharpness > 85) {
    interpretations.push("very sharp");
  } else if (metrics.sharpness > 65) {
    interpretations.push("sharp");
  } else {
    interpretations.push("acceptable sharpness");
  }

  if (metrics.noise > 75) {
    interpretations.push("heavy noise");
  } else if (metrics.noise > 45) {
    interpretations.push("moderate noise");
  } else if (metrics.noise > 20) {
    interpretations.push("slight noise");
  } else {
    interpretations.push("clean");
  }

  return `Image is ${interpretations.join(", ")}.`;
}

export function getRecommendedActions(
  inferenceResult: InferenceResult
): string[] {
  const actions: string[] = [];
  const { crispOutputs } = inferenceResult;

  if (Math.abs(crispOutputs.brightnessAdj) > 20) {
    if (crispOutputs.brightnessAdj > 0) {
      actions.push(
        `Increase brightness by ${crispOutputs.brightnessAdj.toFixed(1)} units`
      );
    } else {
      actions.push(
        `Decrease brightness by ${Math.abs(crispOutputs.brightnessAdj).toFixed(
          1
        )} units`
      );
    }
  }

  if (Math.abs(crispOutputs.contrastAdj - 1) > 0.1) {
    if (crispOutputs.contrastAdj > 1) {
      actions.push(
        `Increase contrast by ${((crispOutputs.contrastAdj - 1) * 100).toFixed(
          0
        )}%`
      );
    } else {
      actions.push(
        `Decrease contrast by ${((1 - crispOutputs.contrastAdj) * 100).toFixed(
          0
        )}%`
      );
    }
  }

  if (crispOutputs.sharpen > 10) {
    actions.push(`Apply ${crispOutputs.sharpen.toFixed(0)}% sharpening`);
  }

  if (crispOutputs.denoise > 10) {
    actions.push(`Apply ${crispOutputs.denoise.toFixed(0)}% noise reduction`);
  }

  if (actions.length === 0) {
    actions.push("No enhancement needed - image quality is already good");
  }

  return actions;
}
