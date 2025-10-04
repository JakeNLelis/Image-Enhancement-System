"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { ImageUploaderProps } from "@/types/fuzzy";
import { loadImageFromFile } from "@/lib/imageAnalysis";

export function ImageUploader({
  onImageUpload,
  isProcessing = false,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      try {
        setSelectedFile(file);
        const imageData = await loadImageFromFile(file);
        onImageUpload(imageData);
      } catch (error) {
        console.error("Error loading image:", error);
        alert("Failed to load image");
      }
    },
    [onImageUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            {selectedFile ? (
              <>
                <ImageIcon className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drop your image here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="sr-only"
              id="file-input"
              disabled={isProcessing}
            />

            <Button
              asChild
              variant={selectedFile ? "outline" : "default"}
              disabled={isProcessing}
            >
              <label htmlFor="file-input" className="cursor-pointer">
                {selectedFile ? "Change Image" : "Select Image"}
              </label>
            </Button>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Supported formats:</h3>
            <p className="text-sm text-muted-foreground">
              JPEG, PNG, WebP • Max size: 10MB
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
