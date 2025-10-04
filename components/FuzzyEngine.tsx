"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { VisualizationDashboard } from "./VisualizationDashboard";
import { FuzzyEngineProps, InferenceResult, ImageMetrics } from "@/types/fuzzy";
import { mamdaniInference } from "@/lib/fuzzyLogic";

// Helper function to create a unique key for metrics
function createMetricsKey(metrics: ImageMetrics): string {
  return `${metrics.brightness.toFixed(2)}-${metrics.contrast.toFixed(
    2
  )}-${metrics.sharpness.toFixed(2)}-${metrics.noise.toFixed(2)}`;
}

// Extended props to include cache clearing functionality
interface ExtendedFuzzyEngineProps extends FuzzyEngineProps {
  clearCacheKey?: string; // When this changes, cache will be cleared
}

export function FuzzyEngine({
  metrics,
  onInferenceComplete,
  clearCacheKey,
}: ExtendedFuzzyEngineProps) {
  const [inferenceResult, setInferenceResult] =
    useState<InferenceResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedMetricsRef = useRef<string | null>(null);
  const inferenceCache = useRef<Map<string, InferenceResult>>(new Map());
  const lastClearKeyRef = useRef<string>("");
  const onInferenceCompleteRef = useRef(onInferenceComplete);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onInferenceCompleteRef.current = onInferenceComplete;
  }, [onInferenceComplete]);

  // Clear cache when clearCacheKey changes (e.g., new image uploaded)
  useEffect(() => {
    if (clearCacheKey && clearCacheKey !== lastClearKeyRef.current) {
      inferenceCache.current.clear();
      processedMetricsRef.current = null;
      lastClearKeyRef.current = clearCacheKey;
    }
  }, [clearCacheKey]);

  // Memoize the inference computation for new metrics only
  const computeInference = useCallback(
    async (metricsToProcess: ImageMetrics): Promise<InferenceResult> => {
      const metricsKey = createMetricsKey(metricsToProcess);

      // Show loading animation for new computation
      setIsProcessing(true);
      // Add a small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = mamdaniInference(metricsToProcess);

      // Cache the result
      inferenceCache.current.set(metricsKey, result);
      processedMetricsRef.current = metricsKey;

      setIsProcessing(false);
      return result;
    },
    []
  );

  useEffect(() => {
    if (!metrics) {
      setInferenceResult(null);
      return;
    }

    const runInference = async () => {
      const metricsKey = createMetricsKey(metrics);

      // If we already processed these exact metrics, use cached result
      if (inferenceCache.current.has(metricsKey)) {
        const cachedResult = inferenceCache.current.get(metricsKey)!;
        setIsProcessing(false); // Ensure loading state is cleared
        setInferenceResult(cachedResult);
        onInferenceCompleteRef.current(cachedResult);
        return;
      }

      try {
        const result = await computeInference(metrics);
        setInferenceResult(result);
        onInferenceCompleteRef.current(result);
      } catch (error) {
        console.error("Fuzzy inference failed:", error);
        setIsProcessing(false);
      }
    };

    runInference();
  }, [metrics, computeInference]); // Removed onInferenceComplete to prevent re-runs

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuzzy Logic Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Waiting for image analysis results
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Fuzzy Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fuzzification</span>
                <span>25%</span>
              </div>
              <Progress value={25} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rule Evaluation</span>
                <span>50%</span>
              </div>
              <Progress value={50} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Aggregation</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Defuzzification</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inferenceResult) return null;

  const { crispOutputs, firedRules } = inferenceResult;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuzzy Logic Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Brightness Adjustment</span>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  {crispOutputs.brightnessAdj > 0 ? "+" : ""}
                  {crispOutputs.brightnessAdj.toFixed(1)}
                </span>
                <Badge
                  variant={
                    crispOutputs.brightnessAdj === 0 ? "default" : "secondary"
                  }
                >
                  {crispOutputs.brightnessAdj === 0
                    ? "No Change"
                    : crispOutputs.brightnessAdj > 0
                    ? "Increase"
                    : "Decrease"}
                </Badge>
              </div>
              <Progress
                value={((crispOutputs.brightnessAdj + 100) / 200) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Contrast Adjustment</span>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ×{crispOutputs.contrastAdj.toFixed(2)}
                </span>
                <Badge
                  variant={
                    crispOutputs.contrastAdj === 1 ? "default" : "secondary"
                  }
                >
                  {crispOutputs.contrastAdj === 1
                    ? "No Change"
                    : crispOutputs.contrastAdj > 1
                    ? "Increase"
                    : "Decrease"}
                </Badge>
              </div>
              <Progress
                value={((crispOutputs.contrastAdj - 0.5) / 1.5) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Sharpen Amount</span>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  {crispOutputs.sharpen.toFixed(1)}%
                </span>
                <Badge
                  variant={crispOutputs.sharpen === 0 ? "default" : "secondary"}
                >
                  {crispOutputs.sharpen === 0
                    ? "None"
                    : crispOutputs.sharpen < 30
                    ? "Low"
                    : crispOutputs.sharpen < 70
                    ? "Medium"
                    : "High"}
                </Badge>
              </div>
              <Progress value={crispOutputs.sharpen} className="h-2" />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Denoise Strength</span>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  {crispOutputs.denoise.toFixed(1)}%
                </span>
                <Badge
                  variant={crispOutputs.denoise === 0 ? "default" : "secondary"}
                >
                  {crispOutputs.denoise === 0
                    ? "None"
                    : crispOutputs.denoise < 30
                    ? "Low"
                    : crispOutputs.denoise < 70
                    ? "Medium"
                    : "High"}
                </Badge>
              </div>
              <Progress value={crispOutputs.denoise} className="h-2" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Active Rules</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {firedRules
                .sort((a, b) => b.firingStrength - a.firingStrength)
                .slice(0, 10)
                .map((firedRule) => (
                  <div
                    key={firedRule.rule.id}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <span>Rule {firedRule.rule.id}</span>
                    <Badge variant="outline">
                      {(firedRule.firingStrength * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing top 10 of {firedRules.length} active rules
            </p>
          </div>
        </CardContent>
      </Card>

      <VisualizationDashboard
        metrics={metrics}
        inferenceResult={inferenceResult}
      />
    </div>
  );
}
