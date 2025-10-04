"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MembershipFunctionChart } from "./MembershipFunctionChart";
import { RuleVisualization } from "./RuleVisualization";
import { ImageMetrics, InferenceResult } from "@/types/fuzzy";
import {
  generateMembershipChartData,
  generateRuleVisualizationData,
  generateLinguisticInterpretation,
  getRecommendedActions,
} from "@/lib/visualizationHelpers";

interface VisualizationDashboardProps {
  metrics: ImageMetrics;
  inferenceResult: InferenceResult;
}

export function VisualizationDashboard({
  metrics,
  inferenceResult,
}: VisualizationDashboardProps) {
  const linguisticInterpretation = generateLinguisticInterpretation(metrics);
  const recommendedActions = getRecommendedActions(inferenceResult);
  const ruleVisualizationData = generateRuleVisualizationData(inferenceResult);

  const inputCharts = [
    generateMembershipChartData("brightness", metrics.brightness),
    generateMembershipChartData("contrast", metrics.contrast),
    generateMembershipChartData("sharpness", metrics.sharpness),
    generateMembershipChartData("noise", metrics.noise),
  ];

  const outputCharts = [
    generateMembershipChartData(
      "brightnessAdj",
      inferenceResult.crispOutputs.brightnessAdj,
      true
    ),
    generateMembershipChartData(
      "contrastAdj",
      inferenceResult.crispOutputs.contrastAdj,
      true
    ),
    generateMembershipChartData(
      "sharpen",
      inferenceResult.crispOutputs.sharpen,
      true
    ),
    generateMembershipChartData(
      "denoise",
      inferenceResult.crispOutputs.denoise,
      true
    ),
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuzzy Logic Visualization Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {inferenceResult.firedRules.length}
              </div>
              <div className="text-sm text-blue-800">Active Rules</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  inferenceResult.firedRules.filter(
                    (r) => r.firingStrength > 0.5
                  ).length
                }
              </div>
              <div className="text-sm text-green-800">
                Strong Rules (&gt;50%)
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(
                  (inferenceResult.firedRules.reduce(
                    (sum, r) => sum + r.firingStrength,
                    0
                  ) /
                    inferenceResult.firedRules.length) *
                  100
                ).toFixed(0)}
                %
              </div>
              <div className="text-sm text-purple-800">
                Avg. Firing Strength
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Linguistic Interpretation</h3>
              <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                {linguisticInterpretation}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recommended Actions</h3>
              <div className="flex flex-wrap gap-2">
                {recommendedActions.map((action, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="input-functions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input-functions">Input Functions</TabsTrigger>
          <TabsTrigger value="output-functions">Output Functions</TabsTrigger>
          <TabsTrigger value="active-rules">Active Rules</TabsTrigger>
          <TabsTrigger value="processing-flow">Process Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="input-functions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inputCharts.map((chartData) => (
              <MembershipFunctionChart
                key={chartData.variable}
                data={chartData}
                height={250}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="output-functions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {outputCharts.map((chartData) => (
              <MembershipFunctionChart
                key={chartData.variable}
                data={chartData}
                height={250}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active-rules" className="space-y-4">
          <RuleVisualization
            rules={ruleVisualizationData}
            maxRulesToShow={15}
          />
        </TabsContent>

        <TabsContent value="processing-flow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">1. Fuzzification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Brightness:</span>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(
                        inferenceResult.fuzzifiedInputs.brightness
                      )
                        .filter(([, value]) => value > 0.1)
                        .map(
                          ([term, value]) =>
                            `${term}: ${(value * 100).toFixed(0)}%`
                        )
                        .join(", ")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Contrast:</span>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(inferenceResult.fuzzifiedInputs.contrast)
                        .filter(([, value]) => value > 0.1)
                        .map(
                          ([term, value]) =>
                            `${term}: ${(value * 100).toFixed(0)}%`
                        )
                        .join(", ")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2. Rule Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {inferenceResult.firedRules.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    rules fired
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    from total of 50 rules
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">3. Aggregation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="font-medium">Max operator used</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Combined {inferenceResult.aggregatedOutputs.length} output
                    variables
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Using Mamdani inference
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">4. Defuzzification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="font-medium">Centroid method</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Brightness:{" "}
                    {inferenceResult.crispOutputs.brightnessAdj.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Contrast:{" "}
                    {inferenceResult.crispOutputs.contrastAdj.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sharpen: {inferenceResult.crispOutputs.sharpen.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fuzzy Inference Process Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Input Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    The system analyzed the input image and extracted quality
                    metrics: brightness ({metrics.brightness.toFixed(1)}),
                    contrast ({metrics.contrast.toFixed(1)}), sharpness (
                    {metrics.sharpness.toFixed(1)}), and noise level (
                    {metrics.noise.toFixed(1)}). These crisp values were then
                    converted to fuzzy membership degrees across multiple
                    linguistic terms.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rule Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    {inferenceResult.firedRules.length} out of 50 fuzzy rules
                    were activated based on the input conditions. The strongest
                    rule had a firing strength of{" "}
                    {(
                      Math.max(
                        ...inferenceResult.firedRules.map(
                          (r) => r.firingStrength
                        )
                      ) * 100
                    ).toFixed(0)}
                    %, while the average firing strength was{" "}
                    {(
                      (inferenceResult.firedRules.reduce(
                        (sum, r) => sum + r.firingStrength,
                        0
                      ) /
                        inferenceResult.firedRules.length) *
                      100
                    ).toFixed(0)}
                    %.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Enhancement Parameters</h4>
                  <p className="text-sm text-muted-foreground">
                    The defuzzification process produced optimal enhancement
                    parameters: brightness adjustment of{" "}
                    {inferenceResult.crispOutputs.brightnessAdj.toFixed(1)}{" "}
                    units, contrast multiplier of{" "}
                    {inferenceResult.crispOutputs.contrastAdj.toFixed(2)},
                    {inferenceResult.crispOutputs.sharpen.toFixed(1)}%
                    sharpening, and{" "}
                    {inferenceResult.crispOutputs.denoise.toFixed(1)}% noise
                    reduction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
