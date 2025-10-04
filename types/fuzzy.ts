export interface Point {
  x: number;
  y: number;
}

export interface TriangularMF {
  type: "triangular";
  points: [number, number, number];
}

export interface TrapezoidalMF {
  type: "trapezoidal";
  points: [number, number, number, number];
}

export type MembershipFunction = TriangularMF | TrapezoidalMF;

// Linguistic Variable Types
export interface LinguisticVariable {
  name: string;
  universe: [number, number];
  terms: Record<string, MembershipFunction>;
}

// Input Variable Terms
export type BrightnessTerms =
  | "VeryDark"
  | "Dark"
  | "Normal"
  | "Bright"
  | "VeryBright";
export type ContrastTerms = "VeryLow" | "Low" | "Medium" | "High" | "VeryHigh";
export type SharpnessTerms =
  | "VeryBlurry"
  | "Blurry"
  | "Acceptable"
  | "Sharp"
  | "VerySharp";
export type NoiseTerms = "Clean" | "Slight" | "Moderate" | "Heavy";

// Output Variable Terms
export type BrightnessAdjustmentTerms =
  | "LargeDecrease"
  | "SmallDecrease"
  | "NoChange"
  | "SmallIncrease"
  | "LargeIncrease";
export type ContrastAdjustmentTerms =
  | "LargeDecrease"
  | "SmallDecrease"
  | "NoChange"
  | "SmallIncrease"
  | "LargeIncrease";
export type SharpenTerms = "None" | "Low" | "Medium" | "High" | "VeryHigh";
export type DenoiseTerms = "None" | "Low" | "Medium" | "High" | "VeryHigh";

// Fuzzy Sets
export interface FuzzySet {
  variable: string;
  term: string;
  membershipValue: number;
}

// Rule Types
export interface FuzzyCondition {
  variable: "brightness" | "contrast" | "sharpness" | "noise";
  term: BrightnessTerms | ContrastTerms | SharpnessTerms | NoiseTerms;
}

export interface FuzzyConsequent {
  variable: "brightnessAdj" | "contrastAdj" | "sharpen" | "denoise";
  term:
    | BrightnessAdjustmentTerms
    | ContrastAdjustmentTerms
    | SharpenTerms
    | DenoiseTerms;
}

export interface FuzzyRule {
  id: number;
  if: FuzzyCondition[];
  then: FuzzyConsequent[];
  description?: string;
}

// Inference Types
export interface FiredRule {
  rule: FuzzyRule;
  firingStrength: number;
  outputs: ClippedOutput[];
}

export interface ClippedOutput {
  variable: string;
  term: string;
  membershipFunction: MembershipFunction;
  clippingLevel: number;
}

export interface AggregatedOutput {
  variable: string;
  aggregatedFunction: Point[];
}

// Image Analysis Types
export interface ImageMetrics {
  brightness: number;
  contrast: number;
  sharpness: number;
  noise: number;
}

export interface EnhancementParameters {
  brightnessAdj: number;
  contrastAdj: number;
  sharpen: number;
  denoise: number;
}

// Fuzzification Types
export interface FuzzifiedInputs {
  brightness: Record<BrightnessTerms, number>;
  contrast: Record<ContrastTerms, number>;
  sharpness: Record<SharpnessTerms, number>;
  noise: Record<NoiseTerms, number>;
}

// Inference Result Types
export interface InferenceResult {
  crispOutputs: EnhancementParameters;
  firedRules: FiredRule[];
  aggregatedOutputs: AggregatedOutput[];
  fuzzifiedInputs: FuzzifiedInputs;
}

// Visualization Types
export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface MembershipFunctionChart {
  variable: string;
  universe: [number, number];
  functions: {
    name: string;
    points: ChartDataPoint[];
    color: string;
  }[];
  currentValue?: number;
}

export interface RuleVisualization {
  ruleId: number;
  description: string;
  firingStrength: number;
  isActive: boolean;
  antecedentValues: {
    variable: string;
    term: string;
    membershipValue: number;
  }[];
  consequentTerms: {
    variable: string;
    term: string;
  }[];
}

// Component Props Types
export interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  isProcessing?: boolean;
}

export interface ImageAnalyzerProps {
  imageData: ImageData | null;
  onAnalysisComplete: (metrics: ImageMetrics) => void;
}

export interface FuzzyEngineProps {
  metrics: ImageMetrics;
  onInferenceComplete: (result: InferenceResult) => void;
}

export interface MembershipFunctionChartProps {
  data: MembershipFunctionChart;
  height?: number;
}

export interface RuleVisualizationProps {
  rules: RuleVisualization[];
  maxRulesToShow?: number;
}

export interface ImageEnhancerProps {
  originalImage: ImageData;
  parameters: EnhancementParameters;
  onEnhancementComplete: (enhancedImage: ImageData) => void;
}

export interface BeforeAfterComparisonProps {
  originalImage: ImageData | null;
  enhancedImage: ImageData | null;
  originalMetrics: ImageMetrics | null;
  enhancedMetrics: ImageMetrics | null;
}

// Utility Types
export interface ProcessingStep {
  name: string;
  description: string;
  isComplete: boolean;
  duration?: number;
}

export interface EducationalInfo {
  linguisticInterpretation: string;
  activeRulesCount: number;
  dominantCharacteristics: string[];
  recommendedActions: string[];
}

// Error Types
export interface FuzzyError {
  type: "ANALYSIS_ERROR" | "INFERENCE_ERROR" | "PROCESSING_ERROR";
  message: string;
  details?: unknown;
}

// Configuration Types
export interface FuzzySystemConfig {
  variables: {
    inputs: Record<string, LinguisticVariable>;
    outputs: Record<string, LinguisticVariable>;
  };
  rules: FuzzyRule[];
  inferenceMethod: "mamdani" | "sugeno";
  defuzzificationMethod: "centroid" | "bisector" | "mom" | "som" | "lom";
}
