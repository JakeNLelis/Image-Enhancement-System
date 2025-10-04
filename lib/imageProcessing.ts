import { EnhancementParameters } from "@/types/fuzzy";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function applyBrightnessAdjustment(
  imageData: ImageData,
  adjustment: number
): ImageData {
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  const data = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + adjustment, 0, 255);
    data[i + 1] = clamp(data[i + 1] + adjustment, 0, 255);
    data[i + 2] = clamp(data[i + 2] + adjustment, 0, 255);
  }

  return newImageData;
}

export function applyContrastAdjustment(
  imageData: ImageData,
  factor: number
): ImageData {
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  const data = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp((data[i] - 128) * factor + 128, 0, 255);
    data[i + 1] = clamp((data[i + 1] - 128) * factor + 128, 0, 255);
    data[i + 2] = clamp((data[i + 2] - 128) * factor + 128, 0, 255);
  }

  return newImageData;
}

export function applySharpen(imageData: ImageData, amount: number): ImageData {
  if (amount === 0) return imageData;

  const intensity = amount / 100;
  const { data, width, height } = imageData;
  const newImageData = new ImageData(width, height);
  const newData = newImageData.data;

  const center = 1 + 4 * intensity;
  const adjacent = -intensity;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        const idx = (y * width + x) * 4 + c;

        if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
          newData[idx] = data[idx];
        } else {
          const sharpened =
            data[idx] * center +
            data[idx - 4] * adjacent +
            data[idx + 4] * adjacent +
            data[idx - width * 4] * adjacent +
            data[idx + width * 4] * adjacent;

          newData[idx] = clamp(sharpened, 0, 255);
        }
      }
      newData[(y * width + x) * 4 + 3] = 255;
    }
  }

  return newImageData;
}

export function applyDenoise(
  imageData: ImageData,
  strength: number
): ImageData {
  if (strength === 0) return imageData;

  const radius = Math.ceil((strength / 100) * 3);
  const { data, width, height } = imageData;
  const newImageData = new ImageData(width, height);
  const newData = newImageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0,
        gSum = 0,
        bSum = 0,
        count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = clamp(x + dx, 0, width - 1);
          const ny = clamp(y + dy, 0, height - 1);
          const idx = (ny * width + nx) * 4;

          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
          count++;
        }
      }

      const outIdx = (y * width + x) * 4;
      newData[outIdx] = rSum / count;
      newData[outIdx + 1] = gSum / count;
      newData[outIdx + 2] = bSum / count;
      newData[outIdx + 3] = 255;
    }
  }

  return newImageData;
}

export function applyEnhancements(
  originalImageData: ImageData,
  parameters: EnhancementParameters
): ImageData {
  let enhancedImageData = originalImageData;

  if (parameters.brightnessAdj !== 0) {
    enhancedImageData = applyBrightnessAdjustment(
      enhancedImageData,
      parameters.brightnessAdj
    );
  }

  if (parameters.contrastAdj !== 1) {
    enhancedImageData = applyContrastAdjustment(
      enhancedImageData,
      parameters.contrastAdj
    );
  }

  if (parameters.sharpen > 0) {
    enhancedImageData = applySharpen(enhancedImageData, parameters.sharpen);
  }

  if (parameters.denoise > 0) {
    enhancedImageData = applyDenoise(enhancedImageData, parameters.denoise);
  }

  return enhancedImageData;
}

export function createHistogram(imageData: ImageData): number[] {
  const histogram = new Array(256).fill(0);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[gray]++;
  }

  return histogram;
}

export function calculateImageStatistics(imageData: ImageData) {
  const { data } = imageData;
  let rSum = 0,
    gSum = 0,
    bSum = 0;
  let rMin = 255,
    gMin = 255,
    bMin = 255;
  let rMax = 0,
    gMax = 0,
    bMax = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    rSum += r;
    gSum += g;
    bSum += b;

    rMin = Math.min(rMin, r);
    gMin = Math.min(gMin, g);
    bMin = Math.min(bMin, b);

    rMax = Math.max(rMax, r);
    gMax = Math.max(gMax, g);
    bMax = Math.max(bMax, b);
  }

  return {
    mean: {
      r: rSum / pixelCount,
      g: gSum / pixelCount,
      b: bSum / pixelCount,
    },
    min: { r: rMin, g: gMin, b: bMin },
    max: { r: rMax, g: gMax, b: bMax },
  };
}
