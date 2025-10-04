import { ImageMetrics } from "@/types/fuzzy";

export function calculateBrightness(imageData: ImageData): number {
  const { data, width, height } = imageData;
  let sum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += gray;
  }

  return sum / (width * height);
}

export function calculateContrast(imageData: ImageData): number {
  const brightness = calculateBrightness(imageData);
  const { data, width, height } = imageData;
  let sumSquaredDiff = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    sumSquaredDiff += Math.pow(gray - brightness, 2);
  }

  const stdDev = Math.sqrt(sumSquaredDiff / (width * height));
  return Math.min((stdDev / 128) * 100, 100);
}

function convertToGrayscale(imageData: ImageData): number[] {
  const { data, width, height } = imageData;
  const gray = new Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const grayValue = 0.299 * r + 0.587 * g + 0.114 * b;
    gray[i / 4] = grayValue;
  }

  return gray;
}

export function calculateSharpness(imageData: ImageData): number {
  const { width, height } = imageData;
  const gray = convertToGrayscale(imageData);

  const kernel = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0],
  ];

  let variance = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let laplacian = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          laplacian += gray[idx] * kernel[ky + 1][kx + 1];
        }
      }
      variance += laplacian * laplacian;
      count++;
    }
  }

  const sharpness = Math.sqrt(variance / count);
  return Math.min((sharpness / 50) * 100, 100);
}

export function calculateNoiseLevel(imageData: ImageData): number {
  const { width, height } = imageData;
  const gray = convertToGrayscale(imageData);

  let highFreqEnergy = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const center = gray[idx];

      const neighbors = [
        gray[idx - 1],
        gray[idx + 1],
        gray[idx - width],
        gray[idx + width],
      ];

      const avgNeighbor = neighbors.reduce((a, b) => a + b, 0) / 4;
      const localVar = Math.abs(center - avgNeighbor);

      highFreqEnergy += localVar;
      count++;
    }
  }

  const avgVariation = highFreqEnergy / count;
  return Math.min((avgVariation / 30) * 100, 100);
}

export function analyzeImage(imageData: ImageData): ImageMetrics {
  return {
    brightness: calculateBrightness(imageData),
    contrast: calculateContrast(imageData),
    sharpness: calculateSharpness(imageData),
    noise: calculateNoiseLevel(imageData),
  };
}

export function loadImageFromFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imageData.width;
  canvas.height = imageData.height;

  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    });
  });
}

export function resizeImageData(
  imageData: ImageData,
  maxWidth: number,
  maxHeight: number
): ImageData {
  const { width, height } = imageData;

  if (width <= maxWidth && height <= maxHeight) {
    return imageData;
  }

  const scale = Math.min(maxWidth / width, maxHeight / height);
  const newWidth = Math.floor(width * scale);
  const newHeight = Math.floor(height * scale);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    ctx.putImageData(imageData, 0, 0);

    const newCanvas = document.createElement("canvas");
    const newCtx = newCanvas.getContext("2d");

    newCanvas.width = newWidth;
    newCanvas.height = newHeight;

    if (newCtx) {
      newCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
      return newCtx.getImageData(0, 0, newWidth, newHeight);
    }
  }

  return imageData;
}
