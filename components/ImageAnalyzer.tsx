"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ImageAnalyzerProps, ImageMetrics } from "@/types/fuzzy";
import { analyzeImage } from "@/lib/imageAnalysis";

function getQualityLabel(
  value: number,
  type: "brightness" | "contrast" | "sharpness" | "noise"
): string {
  switch (type) {
    case "brightness":
      if (value < 60) return "Dark";
      if (value < 120) return "Normal";
      if (value < 180) return "Bright";
      return "Very Bright";
    case "contrast":
      if (value < 20) return "Very Low";
      if (value < 40) return "Low";
      if (value < 70) return "Medium";
      if (value < 85) return "High";
      return "Very High";
    case "sharpness":
      if (value < 25) return "Very Blurry";
      if (value < 45) return "Blurry";
      if (value < 65) return "Acceptable";
      if (value < 85) return "Sharp";
      return "Very Sharp";
    case "noise":
      if (value < 20) return "Clean";
      if (value < 45) return "Slight";
      if (value < 75) return "Moderate";
      return "Heavy";
    default:
      return "Unknown";
  }
}

function getQualityColor(
  value: number,
  type: "brightness" | "contrast" | "sharpness" | "noise"
): string {
  switch (type) {
    case "brightness":
      if (value < 60 || value > 200) return "destructive";
      if (value < 100 || value > 160) return "secondary";
      return "default";
    case "contrast":
      if (value < 20 || value > 90) return "destructive";
      if (value < 40 || value > 75) return "secondary";
      return "default";
    case "sharpness":
      if (value < 45) return "destructive";
      if (value < 65) return "secondary";
      return "default";
    case "noise":
      if (value > 60) return "destructive";
      if (value > 30) return "secondary";
      return "default";
    default:
      return "default";
  }
}

export function ImageAnalyzer({
  imageData,
  onAnalysisComplete,
}: ImageAnalyzerProps) {
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!imageData) {
      setMetrics(null);
      return;
    }

    const analyze = async () => {
      setIsAnalyzing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const analyzedMetrics = analyzeImage(imageData);
        setMetrics(analyzedMetrics);
        onAnalysisComplete(analyzedMetrics);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyze();
  }, [imageData, onAnalysisComplete]);

  if (!imageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Image Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Upload an image to see analysis results
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Image...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Extracting features</span>
                <span>Processing...</span>
              </div>
              <Progress value={100} className="animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Quality Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Brightness</span>
              <Badge
                variant={
                  getQualityColor(metrics.brightness, "brightness") as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
              >
                {getQualityLabel(metrics.brightness, "brightness")}
              </Badge>
            </div>
            <Progress value={(metrics.brightness / 255) * 100} />
            <p className="text-xs text-muted-foreground">
              Value: {metrics.brightness.toFixed(1)} / 255
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Contrast</span>
              <Badge
                variant={
                  getQualityColor(metrics.contrast, "contrast") as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
              >
                {getQualityLabel(metrics.contrast, "contrast")}
              </Badge>
            </div>
            <Progress value={metrics.contrast} />
            <p className="text-xs text-muted-foreground">
              Value: {metrics.contrast.toFixed(1)} / 100
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sharpness</span>
              <Badge
                variant={
                  getQualityColor(metrics.sharpness, "sharpness") as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
              >
                {getQualityLabel(metrics.sharpness, "sharpness")}
              </Badge>
            </div>
            <Progress value={metrics.sharpness} />
            <p className="text-xs text-muted-foreground">
              Value: {metrics.sharpness.toFixed(1)} / 100
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Noise Level</span>
              <Badge
                variant={
                  getQualityColor(metrics.noise, "noise") as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
              >
                {getQualityLabel(metrics.noise, "noise")}
              </Badge>
            </div>
            <Progress value={metrics.noise} />
            <p className="text-xs text-muted-foreground">
              Value: {metrics.noise.toFixed(1)} / 100
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Image Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            {imageData.width} × {imageData.height} pixels
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
