"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BeforeAfterComparisonProps } from "@/types/fuzzy";
import { imageDataToCanvas, canvasToBlob } from "@/lib/imageAnalysis";

export function BeforeAfterComparison({
  originalImage,
  enhancedImage,
  originalMetrics,
  enhancedMetrics,
}: BeforeAfterComparisonProps) {
  const [originalCanvas, setOriginalCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const [enhancedCanvas, setEnhancedCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const originalContainerRef = useRef<HTMLDivElement>(null);
  const enhancedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (originalImage) {
      const canvas = imageDataToCanvas(originalImage);
      setOriginalCanvas(canvas);
    }
  }, [originalImage]);

  useEffect(() => {
    if (enhancedImage) {
      const canvas = imageDataToCanvas(enhancedImage);
      setEnhancedCanvas(canvas);
    }
  }, [enhancedImage]);

  useEffect(() => {
    if (originalCanvas && originalContainerRef.current) {
      originalContainerRef.current.innerHTML = "";
      originalCanvas.style.maxWidth = "100%";
      originalCanvas.style.height = "auto";
      originalCanvas.style.border = "1px solid #e5e7eb";
      originalCanvas.style.borderRadius = "8px";
      originalContainerRef.current.appendChild(originalCanvas);
    }
  }, [originalCanvas]);

  useEffect(() => {
    if (enhancedCanvas && enhancedContainerRef.current) {
      enhancedContainerRef.current.innerHTML = "";
      enhancedCanvas.style.maxWidth = "100%";
      enhancedCanvas.style.height = "auto";
      enhancedCanvas.style.border = "1px solid #e5e7eb";
      enhancedCanvas.style.borderRadius = "8px";
      enhancedContainerRef.current.appendChild(enhancedCanvas);
    }
  }, [enhancedCanvas]);

  const handleDownload = async () => {
    if (!enhancedCanvas) return;

    try {
      const blob = await canvasToBlob(enhancedCanvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "enhanced-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getImprovementBadge = (
    original: number,
    enhanced: number,
    type: "brightness" | "contrast" | "sharpness" | "noise"
  ) => {
    let isImproved = false;

    switch (type) {
      case "brightness":
        isImproved = Math.abs(enhanced - 127.5) < Math.abs(original - 127.5);
        break;
      case "contrast":
        isImproved = enhanced > original && enhanced > 30;
        break;
      case "sharpness":
        isImproved = enhanced > original;
        break;
      case "noise":
        isImproved = enhanced < original;
        break;
    }

    const difference =
      type === "noise" ? original - enhanced : enhanced - original;

    return (
      <Badge variant={isImproved ? "default" : "secondary"}>
        {difference > 0 ? "+" : ""}
        {difference.toFixed(1)}
      </Badge>
    );
  };

  if (!originalImage || !enhancedImage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Before & After Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Process an image to see the comparison
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Before & After Comparison
          <Button
            onClick={handleDownload}
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Enhanced
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Original Image</h3>
            <div ref={originalContainerRef} className="w-full" />
          </div>

          <div>
            <h3 className="font-medium mb-3">Enhanced Image</h3>
            <div ref={enhancedContainerRef} className="w-full" />
          </div>
        </div>

        {originalMetrics && enhancedMetrics && (
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Quality Metrics Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brightness</span>
                  {getImprovementBadge(
                    originalMetrics.brightness,
                    enhancedMetrics.brightness,
                    "brightness"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {originalMetrics.brightness.toFixed(1)} →{" "}
                  {enhancedMetrics.brightness.toFixed(1)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contrast</span>
                  {getImprovementBadge(
                    originalMetrics.contrast,
                    enhancedMetrics.contrast,
                    "contrast"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {originalMetrics.contrast.toFixed(1)} →{" "}
                  {enhancedMetrics.contrast.toFixed(1)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sharpness</span>
                  {getImprovementBadge(
                    originalMetrics.sharpness,
                    enhancedMetrics.sharpness,
                    "sharpness"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {originalMetrics.sharpness.toFixed(1)} →{" "}
                  {enhancedMetrics.sharpness.toFixed(1)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Noise</span>
                  {getImprovementBadge(
                    originalMetrics.noise,
                    enhancedMetrics.noise,
                    "noise"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {originalMetrics.noise.toFixed(1)} →{" "}
                  {enhancedMetrics.noise.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
