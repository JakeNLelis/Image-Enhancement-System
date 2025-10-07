"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { FuzzyEngine } from "@/components/FuzzyEngine";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeToggleDropdown } from "@/components/theme-toggle-dropdown";
import { ImageMetrics, InferenceResult } from "@/types/fuzzy";
import { applyEnhancements } from "@/lib/imageProcessing";
import { analyzeImage } from "@/lib/imageAnalysis";

export default function Home() {
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );
  const [enhancedImageData, setEnhancedImageData] = useState<ImageData | null>(
    null
  );
  const [originalMetrics, setOriginalMetrics] = useState<ImageMetrics | null>(
    null
  );
  const [enhancedMetrics, setEnhancedMetrics] = useState<ImageMetrics | null>(
    null
  );
  const [inferenceResult, setInferenceResult] =
    useState<InferenceResult | null>(null);
  const [cacheKey, setCacheKey] = useState<string>("");

  const handleImageUpload = useCallback((imageData: ImageData) => {
    setOriginalImageData(imageData);
    setEnhancedImageData(null);
    setOriginalMetrics(null);
    setEnhancedMetrics(null);
    setInferenceResult(null);
    // Generate new cache key to clear fuzzy engine cache
    setCacheKey(Date.now().toString());
  }, []);

  const handleAnalysisComplete = useCallback((metrics: ImageMetrics) => {
    setOriginalMetrics(metrics);
  }, []);

  const handleInferenceComplete = useCallback(
    async (result: InferenceResult) => {
      if (!originalImageData) return;

      setInferenceResult(result);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const enhanced = applyEnhancements(
          originalImageData,
          result.crispOutputs
        );
        setEnhancedImageData(enhanced);

        const enhancedMetrics = analyzeImage(enhanced);
        setEnhancedMetrics(enhancedMetrics);
      } catch (error) {
        console.error("Enhancement failed:", error);
      }
    },
    [originalImageData]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed position, mobile-friendly */}
      <div className="fixed top-4 right-4 z-40">
        {/* Simple toggle for mobile, dropdown for desktop */}
        <div className="block sm:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden sm:block">
          <ThemeToggleDropdown />
        </div>
      </div>

      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Intelligent Image Quality Enhancer
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground px-4">
            Using Fuzzy Logic System for Automatic Image Enhancement
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-4 md:space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="upload" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Upload & Analyze</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger
              value="fuzzy"
              disabled={!originalMetrics}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Fuzzy Processing</span>
              <span className="sm:hidden">Fuzzy</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!enhancedImageData}
              className="text-xs sm:text-sm"
            >
              Results
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              disabled={!enhancedImageData}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Comparison</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <ImageUploader onImageUpload={handleImageUpload} />
              <ImageAnalyzer
                imageData={originalImageData}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="fuzzy" className="space-y-4 md:space-y-6">
            {originalMetrics && (
              <FuzzyEngine
                metrics={originalMetrics}
                onInferenceComplete={handleInferenceComplete}
                clearCacheKey={cacheKey}
              />
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4 md:space-y-6">
            {inferenceResult && (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="p-3 md:p-4 border rounded-lg text-center">
                    <div className="text-lg md:text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.brightnessAdj > 0
                        ? "+"
                        : ""}
                      {inferenceResult.crispOutputs.brightnessAdj.toFixed(1)}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Brightness
                    </div>
                  </div>
                  <div className="p-3 md:p-4 border rounded-lg text-center">
                    <div className="text-lg md:text-2xl font-bold text-primary">
                      ×{inferenceResult.crispOutputs.contrastAdj.toFixed(2)}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Contrast
                    </div>
                  </div>
                  <div className="p-3 md:p-4 border rounded-lg text-center">
                    <div className="text-lg md:text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.sharpen.toFixed(1)}%
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Sharpen
                    </div>
                  </div>
                  <div className="p-3 md:p-4 border rounded-lg text-center">
                    <div className="text-lg md:text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.denoise.toFixed(1)}%
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Denoise
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 border rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold mb-4">
                    Processing Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-blue-600">
                        {inferenceResult.firedRules.length}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Rules Fired
                      </div>
                    </div>
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-green-600">
                        {Object.keys(inferenceResult.fuzzifiedInputs).length}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Input Variables
                      </div>
                    </div>
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-purple-600">
                        {inferenceResult.aggregatedOutputs.length}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Output Variables
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4 md:space-y-6">
            <BeforeAfterComparison
              originalImage={originalImageData}
              enhancedImage={enhancedImageData}
              originalMetrics={originalMetrics}
              enhancedMetrics={enhancedMetrics}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
