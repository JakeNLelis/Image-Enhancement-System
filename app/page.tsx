"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { FuzzyEngine } from "@/components/FuzzyEngine";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";
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
  const [isProcessing, setIsProcessing] = useState(false);
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

      setIsProcessing(true);
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
      } finally {
        setIsProcessing(false);
      }
    },
    [originalImageData]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Intelligent Image Quality Enhancer
          </h1>
          <p className="text-lg text-muted-foreground">
            Using Fuzzy Logic System for Automatic Image Enhancement
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="fuzzy" disabled={!originalMetrics}>
              Fuzzy Processing
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!enhancedImageData}>
              Results
            </TabsTrigger>
            <TabsTrigger value="comparison" disabled={!enhancedImageData}>
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImageUploader
                onImageUpload={handleImageUpload}
                isProcessing={isProcessing}
              />
              <ImageAnalyzer
                imageData={originalImageData}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="fuzzy" className="space-y-6">
            {originalMetrics && (
              <FuzzyEngine
                metrics={originalMetrics}
                onInferenceComplete={handleInferenceComplete}
                clearCacheKey={cacheKey}
              />
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {inferenceResult && (
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.brightnessAdj > 0
                        ? "+"
                        : ""}
                      {inferenceResult.crispOutputs.brightnessAdj.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Brightness
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      ×{inferenceResult.crispOutputs.contrastAdj.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Contrast
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.sharpen.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Sharpen</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {inferenceResult.crispOutputs.denoise.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Denoise</div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Processing Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {inferenceResult.firedRules.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rules Fired
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(inferenceResult.fuzzifiedInputs).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Input Variables
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {inferenceResult.aggregatedOutputs.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Output Variables
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <BeforeAfterComparison
              originalImage={originalImageData}
              enhancedImage={enhancedImageData}
              originalMetrics={originalMetrics}
              enhancedMetrics={enhancedMetrics}
            />
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Processing image enhancement...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
