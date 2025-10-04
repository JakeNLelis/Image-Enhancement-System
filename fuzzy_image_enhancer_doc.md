# Fuzzy Image Enhancement System - Complete Development Documentation

## Project Overview

### Project Title

**Intelligent Image Quality Enhancer using Fuzzy Logic System**

### Project Description

Build a web-based image enhancement application using Next.js that automatically improves image quality through fuzzy logic inference. The system analyzes uploaded images to extract quality metrics (brightness, contrast, sharpness, noise level) and applies intelligent enhancement parameters determined by a fuzzy inference system. The application should provide real-time visual feedback showing the fuzzy reasoning process, including membership function graphs, rule firing visualization, and before/after image comparison.

### Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Image Processing:** HTML Canvas API
- **Charting:** Recharts (for membership function visualization)
- **State Management:** React useState hooks
- **No database required** - Pure client-side processing

### Core Features Required

1. **Image Upload Interface**

   - Drag-and-drop or file selector
   - Support for JPEG, PNG, WebP formats
   - Client-side image processing only

2. **Image Analysis Module**

   - Extract brightness (average luminosity 0-255)
   - Calculate contrast (standard deviation of pixel intensities)
   - Measure sharpness (edge detection strength 0-100)
   - Detect noise level (high-frequency analysis 0-100)
   - Display extracted metrics numerically and linguistically

3. **Fuzzy Logic Engine**

   - Implement complete fuzzification
   - Apply all 50 fuzzy rules
   - Perform Mamdani inference
   - Execute centroid defuzzification
   - Show rule firing strengths

4. **Visualization Dashboard**

   - Display membership function graphs for each input variable
   - Show which fuzzy rules are active and their firing strength
   - Visualize defuzzification process
   - Real-time parameter adjustments

5. **Image Enhancement Application**

   - Apply brightness adjustment
   - Apply contrast adjustment
   - Apply sharpening filter
   - Apply denoising filter
   - Side-by-side before/after comparison

6. **Educational Display**
   - Show linguistic interpretations (e.g., "Image is DARK with LOW CONTRAST")
   - Display active rules in plain English
   - Show fuzzy output values before defuzzification

---

## System Architecture

### Component Structure

```
app/
├── page.tsx (Main page)
├── components/
│   ├── ImageUploader.tsx
│   ├── ImageAnalyzer.tsx
│   ├── FuzzyEngine.tsx
│   ├── MembershipFunctionChart.tsx
│   ├── RuleVisualization.tsx
│   ├── ImageEnhancer.tsx
│   └── BeforeAfterComparison.tsx
├── lib/
│   ├── imageAnalysis.ts
│   ├── fuzzyLogic.ts
│   ├── membershipFunctions.ts
│   ├── fuzzyRules.ts
│   └── imageProcessing.ts
└── types/
    └── fuzzy.ts
```

### Data Flow

1. User uploads image → ImageUploader
2. Canvas extracts pixel data → ImageAnalyzer
3. Calculate metrics → imageAnalysis.ts
4. Fuzzify inputs → fuzzyLogic.ts
5. Apply rules → fuzzyRules.ts
6. Defuzzify outputs → fuzzyLogic.ts
7. Apply enhancements → imageProcessing.ts
8. Display results → BeforeAfterComparison

---

## Fuzzy Logic System Specification

### 1. Linguistic Variables Definition

#### Input Variables

**Variable 1: Brightness**

- **Universe of Discourse:** [0, 255]
- **Physical Meaning:** Average pixel luminosity of the image
- **Linguistic Terms:**
  - Very Dark (VD)
  - Dark (D)
  - Normal (N)
  - Bright (B)
  - Very Bright (VB)

**Variable 2: Contrast**

- **Universe of Discourse:** [0, 100]
- **Physical Meaning:** Standard deviation of pixel intensities (normalized)
- **Linguistic Terms:**
  - Very Low (VL)
  - Low (L)
  - Medium (M)
  - High (H)
  - Very High (VH)

**Variable 3: Sharpness**

- **Universe of Discourse:** [0, 100]
- **Physical Meaning:** Edge detection strength using Laplacian variance
- **Linguistic Terms:**
  - Very Blurry (VBL)
  - Blurry (BL)
  - Acceptable (A)
  - Sharp (S)
  - Very Sharp (VS)

**Variable 4: Noise Level**

- **Universe of Discourse:** [0, 100]
- **Physical Meaning:** High-frequency component intensity
- **Linguistic Terms:**
  - Clean (CL)
  - Slight (SL)
  - Moderate (MO)
  - Heavy (HV)

#### Output Variables

**Variable 1: Brightness Adjustment**

- **Universe of Discourse:** [-100, 100]
- **Physical Meaning:** Amount to add/subtract from pixel values
- **Linguistic Terms:**
  - Large Decrease (LD)
  - Small Decrease (SD)
  - No Change (NC)
  - Small Increase (SI)
  - Large Increase (LI)

**Variable 2: Contrast Adjustment**

- **Universe of Discourse:** [0.5, 2.0]
- **Physical Meaning:** Multiplier for pixel deviation from mean
- **Linguistic Terms:**
  - Large Decrease (LD)
  - Small Decrease (SD)
  - No Change (NC)
  - Small Increase (SI)
  - Large Increase (LI)

**Variable 3: Sharpen Amount**

- **Universe of Discourse:** [0, 100]
- **Physical Meaning:** Intensity of sharpening filter application
- **Linguistic Terms:**
  - None (NO)
  - Low (LO)
  - Medium (ME)
  - High (HI)
  - Very High (VH)

**Variable 4: Denoise Strength**

- **Universe of Discourse:** [0, 100]
- **Physical Meaning:** Intensity of noise reduction filter
- **Linguistic Terms:**
  - None (NO)
  - Low (LO)
  - Medium (ME)
  - High (HI)
  - Very High (VH)

---

### 2. Membership Functions

#### Implementation Format

Use trapezoidal: `[a, b, c, d]` where membership is 0 at a, rises to 1 at b, stays 1 until c, falls to 0 at d
Use triangular: `[a, b, c]` where membership is 0 at a, peaks at 1 at b, returns to 0 at c

#### Input Membership Functions

**Brightness (0-255)**

```typescript
VeryDark:    { type: 'trapezoidal', points: [0, 0, 40, 80] }
Dark:        { type: 'triangular', points: [40, 80, 120] }
Normal:      { type: 'triangular', points: [80, 127, 175] }
Bright:      { type: 'triangular', points: [135, 175, 215] }
VeryBright:  { type: 'trapezoidal', points: [175, 215, 255, 255] }
```

**Contrast (0-100)**

```typescript
VeryLow:     { type: 'trapezoidal', points: [0, 0, 15, 25] }
Low:         { type: 'triangular', points: [15, 25, 40] }
Medium:      { type: 'triangular', points: [30, 50, 70] }
High:        { type: 'triangular', points: [60, 75, 90] }
VeryHigh:    { type: 'trapezoidal', points: [80, 90, 100, 100] }
```

**Sharpness (0-100)**

```typescript
VeryBlurry:  { type: 'trapezoidal', points: [0, 0, 15, 30] }
Blurry:      { type: 'triangular', points: [15, 30, 50] }
Acceptable:  { type: 'triangular', points: [40, 55, 70] }
Sharp:       { type: 'triangular', points: [60, 75, 90] }
VerySharp:   { type: 'trapezoidal', points: [80, 90, 100, 100] }
```

**Noise Level (0-100)**

```typescript
Clean:       { type: 'trapezoidal', points: [0, 0, 10, 25] }
Slight:      { type: 'triangular', points: [15, 30, 50] }
Moderate:    { type: 'triangular', points: [40, 60, 80] }
Heavy:       { type: 'trapezoidal', points: [70, 85, 100, 100] }
```

#### Output Membership Functions

**Brightness Adjustment (-100 to +100)**

```typescript
LargeDecrease:  { type: 'trapezoidal', points: [-100, -100, -80, -60] }
SmallDecrease:  { type: 'triangular', points: [-70, -40, -15] }
NoChange:       { type: 'triangular', points: [-20, 0, 20] }
SmallIncrease:  { type: 'triangular', points: [15, 40, 70] }
LargeIncrease:  { type: 'trapezoidal', points: [60, 80, 100, 100] }
```

**Contrast Adjustment (0.5 to 2.0)**

```typescript
LargeDecrease:  { type: 'trapezoidal', points: [0.5, 0.5, 0.6, 0.7] }
SmallDecrease:  { type: 'triangular', points: [0.7, 0.8, 0.9] }
NoChange:       { type: 'triangular', points: [0.9, 1.0, 1.1] }
SmallIncrease:  { type: 'triangular', points: [1.1, 1.3, 1.5] }
LargeIncrease:  { type: 'trapezoidal', points: [1.5, 1.7, 2.0, 2.0] }
```

**Sharpen Amount (0-100)**

```typescript
None:        { type: 'trapezoidal', points: [0, 0, 5, 15] }
Low:         { type: 'triangular', points: [10, 20, 35] }
Medium:      { type: 'triangular', points: [30, 45, 65] }
High:        { type: 'triangular', points: [60, 75, 90] }
VeryHigh:    { type: 'trapezoidal', points: [85, 92, 100, 100] }
```

**Denoise Strength (0-100)**

```typescript
None:        { type: 'trapezoidal', points: [0, 0, 5, 15] }
Low:         { type: 'triangular', points: [10, 25, 40] }
Medium:      { type: 'triangular', points: [35, 50, 70] }
High:        { type: 'triangular', points: [65, 80, 95] }
VeryHigh:    { type: 'trapezoidal', points: [90, 95, 100, 100] }
```

---

### 3. Fuzzy Rule Base (50 Rules)

#### Rule Format

```
IF <antecedent1> AND <antecedent2> ... THEN <consequent1> AND <consequent2> ...
```

#### Brightness Enhancement Rules (Rules 1-9)

**Rule 1:**

```
IF Brightness is VeryDark
THEN BrightnessAdj is LargeIncrease AND ContrastAdj is SmallIncrease
```

**Rule 2:**

```
IF Brightness is VeryDark AND Contrast is VeryLow
THEN BrightnessAdj is LargeIncrease AND ContrastAdj is LargeIncrease
```

**Rule 3:**

```
IF Brightness is Dark
THEN BrightnessAdj is SmallIncrease
```

**Rule 4:**

```
IF Brightness is Dark AND Contrast is Low
THEN ContrastAdj is SmallIncrease
```

**Rule 5:**

```
IF Brightness is Normal AND Contrast is Medium
THEN BrightnessAdj is NoChange AND ContrastAdj is NoChange
```

**Rule 6:**

```
IF Brightness is Bright
THEN BrightnessAdj is SmallDecrease
```

**Rule 7:**

```
IF Brightness is Bright AND Contrast is High
THEN ContrastAdj is SmallDecrease
```

**Rule 8:**

```
IF Brightness is VeryBright
THEN BrightnessAdj is LargeDecrease AND ContrastAdj is SmallDecrease
```

**Rule 9:**

```
IF Brightness is VeryBright AND Contrast is VeryHigh
THEN BrightnessAdj is LargeDecrease AND ContrastAdj is LargeDecrease
```

#### Contrast Enhancement Rules (Rules 10-18)

**Rule 10:**

```
IF Contrast is VeryLow AND Brightness is Normal
THEN ContrastAdj is LargeIncrease
```

**Rule 11:**

```
IF Contrast is VeryLow AND Brightness is Dark
THEN ContrastAdj is SmallIncrease
```

**Rule 12:**

```
IF Contrast is Low
THEN ContrastAdj is SmallIncrease
```

**Rule 13:**

```
IF Contrast is Medium AND Brightness is Normal
THEN ContrastAdj is NoChange
```

**Rule 14:**

```
IF Contrast is High AND Brightness is Bright
THEN ContrastAdj is SmallDecrease
```

**Rule 15:**

```
IF Contrast is High
THEN ContrastAdj is SmallDecrease
```

**Rule 16:**

```
IF Contrast is VeryHigh
THEN ContrastAdj is LargeDecrease
```

**Rule 17:**

```
IF Contrast is VeryLow AND Sharpness is VeryBlurry
THEN ContrastAdj is LargeIncrease AND Sharpen is Medium
```

**Rule 18:**

```
IF Contrast is Low AND Sharpness is Blurry
THEN Sharpen is Low
```

#### Sharpness Enhancement Rules (Rules 19-29)

**Rule 19:**

```
IF Sharpness is VeryBlurry AND Noise is Clean
THEN Sharpen is VeryHigh
```

**Rule 20:**

```
IF Sharpness is VeryBlurry AND Noise is Slight
THEN Sharpen is High AND Denoise is Low
```

**Rule 21:**

```
IF Sharpness is VeryBlurry AND Noise is Moderate
THEN Sharpen is Medium AND Denoise is Medium
```

**Rule 22:**

```
IF Sharpness is Blurry AND Noise is Clean
THEN Sharpen is High
```

**Rule 23:**

```
IF Sharpness is Blurry AND Noise is Slight
THEN Sharpen is Medium AND Denoise is Low
```

**Rule 24:**

```
IF Sharpness is Blurry AND Noise is Moderate
THEN Sharpen is Low AND Denoise is High
```

**Rule 25:**

```
IF Sharpness is Acceptable AND Noise is Clean
THEN Sharpen is Low
```

**Rule 26:**

```
IF Sharpness is Acceptable AND Noise is Slight
THEN Sharpen is None AND Denoise is Low
```

**Rule 27:**

```
IF Sharpness is Sharp
THEN Sharpen is None
```

**Rule 28:**

```
IF Sharpness is VerySharp
THEN Sharpen is None
```

**Rule 29:**

```
IF Sharpness is VerySharp AND Brightness is VeryDark
THEN BrightnessAdj is LargeIncrease
```

#### Noise Reduction Rules (Rules 30-38)

**Rule 30:**

```
IF Noise is Clean
THEN Denoise is None
```

**Rule 31:**

```
IF Noise is Slight AND Sharpness is Sharp
THEN Denoise is Low
```

**Rule 32:**

```
IF Noise is Slight AND Sharpness is Acceptable
THEN Denoise is Low
```

**Rule 33:**

```
IF Noise is Slight AND Sharpness is Blurry
THEN Denoise is Medium
```

**Rule 34:**

```
IF Noise is Moderate AND Sharpness is VerySharp
THEN Denoise is Medium AND Sharpen is None
```

**Rule 35:**

```
IF Noise is Moderate AND Sharpness is Sharp
THEN Denoise is High AND Sharpen is None
```

**Rule 36:**

```
IF Noise is Moderate
THEN Denoise is High
```

**Rule 37:**

```
IF Noise is Heavy AND Sharpness is VeryBlurry
THEN Denoise is VeryHigh AND Sharpen is None
```

**Rule 38:**

```
IF Noise is Heavy
THEN Denoise is VeryHigh AND Sharpen is None
```

#### Combined Quality Rules (Rules 39-46)

**Rule 39:**

```
IF Brightness is Normal AND Contrast is Medium AND Sharpness is Sharp AND Noise is Clean
THEN BrightnessAdj is NoChange AND ContrastAdj is NoChange AND Sharpen is None AND Denoise is None
```

**Rule 40:**

```
IF Brightness is VeryDark AND Contrast is VeryLow AND Sharpness is VeryBlurry
THEN BrightnessAdj is LargeIncrease AND ContrastAdj is LargeIncrease AND Sharpen is Medium
```

**Rule 41:**

```
IF Brightness is VeryBright AND Contrast is VeryHigh AND Sharpness is VerySharp
THEN BrightnessAdj is LargeDecrease AND ContrastAdj is LargeDecrease AND Sharpen is None
```

**Rule 42:**

```
IF Contrast is VeryLow AND Sharpness is VeryBlurry AND Noise is Heavy
THEN ContrastAdj is SmallIncrease AND Sharpen is None AND Denoise is VeryHigh
```

**Rule 43:**

```
IF Brightness is Dark AND Contrast is Low AND Noise is Moderate
THEN BrightnessAdj is SmallIncrease AND ContrastAdj is SmallIncrease AND Denoise is Medium
```

**Rule 44:**

```
IF Brightness is Bright AND Sharpness is Blurry AND Noise is Slight
THEN BrightnessAdj is SmallDecrease AND Sharpen is Medium AND Denoise is Low
```

**Rule 45:**

```
IF Contrast is High AND Sharpness is VerySharp AND Noise is Clean
THEN ContrastAdj is SmallDecrease AND Sharpen is None
```

**Rule 46:**

```
IF Brightness is VeryDark AND Noise is Heavy
THEN BrightnessAdj is LargeIncrease AND Denoise is VeryHigh AND Sharpen is None
```

#### Edge Case Rules (Rules 47-50)

**Rule 47:**

```
IF Brightness is VeryBright AND Contrast is VeryLow
THEN BrightnessAdj is LargeDecrease AND ContrastAdj is LargeIncrease
```

**Rule 48:**

```
IF Brightness is VeryDark AND Contrast is VeryHigh
THEN BrightnessAdj is LargeIncrease AND ContrastAdj is SmallDecrease
```

**Rule 49:**

```
IF Sharpness is VeryBlurry AND Noise is Heavy AND Contrast is VeryLow
THEN Denoise is VeryHigh AND Sharpen is None AND ContrastAdj is SmallIncrease
```

**Rule 50:**

```
IF Brightness is Normal AND Contrast is Medium AND Sharpness is Blurry AND Noise is Moderate
THEN Sharpen is None AND Denoise is High
```

---

### 4. Inference Method

#### Mamdani Inference System

**Step 1: Fuzzification**

- Convert each crisp input value to fuzzy membership degrees
- For each linguistic term, calculate membership value using defined membership functions
- Example: If brightness = 50, calculate μ_VeryDark(50), μ_Dark(50), μ_Normal(50), etc.

**Step 2: Rule Evaluation**

- For each rule, evaluate the antecedent using the AND operator (minimum)
- Calculate rule firing strength: min(μ_antecedent1, μ_antecedent2, ...)
- Example: Rule "IF Brightness is Dark AND Contrast is Low"
  - Firing strength = min(μ_Dark(brightness), μ_Low(contrast))

**Step 3: Implication**

- Apply the firing strength to consequent membership functions
- Use minimum implication method
- Clip the output membership function at the firing strength level

**Step 4: Aggregation**

- Combine all clipped output membership functions
- Use maximum operator (take the highest membership value at each point)
- Results in a single fuzzy set for each output variable

**Step 5: Defuzzification**

- Convert aggregated fuzzy output to crisp value
- Use Centroid method (center of gravity):
  ```
  crisp_output = Σ(x * μ(x)) / Σ(μ(x))
  ```
- Calculate for each output variable independently

#### Implementation Pseudocode

```typescript
function mamdaniInference(inputs, rules, membershipFunctions) {
  // Step 1: Fuzzification
  const fuzzifiedInputs = fuzzify(inputs, membershipFunctions.inputs);

  // Step 2 & 3: Rule Evaluation and Implication
  const firedRules = [];
  for (const rule of rules) {
    const firingStrength = evaluateAntecedent(rule.if, fuzzifiedInputs);
    if (firingStrength > 0) {
      const clippedOutputs = applyImplication(rule.then, firingStrength);
      firedRules.push({ rule, firingStrength, outputs: clippedOutputs });
    }
  }

  // Step 4: Aggregation
  const aggregatedOutputs = aggregate(firedRules, membershipFunctions.outputs);

  // Step 5: Defuzzification
  const crispOutputs = defuzzify(aggregatedOutputs);

  return { crispOutputs, firedRules, aggregatedOutputs };
}
```

---

### 5. Image Analysis Algorithms

#### Brightness Calculation

```typescript
function calculateBrightness(imageData: ImageData): number {
  const { data, width, height } = imageData;
  let sum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Convert to grayscale using luminosity method
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += gray;
  }

  return sum / (width * height); // Returns 0-255
}
```

#### Contrast Calculation

```typescript
function calculateContrast(imageData: ImageData): number {
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
  // Normalize to 0-100 scale (assuming max std dev of 128)
  return Math.min((stdDev / 128) * 100, 100);
}
```

#### Sharpness Calculation (Laplacian Variance)

```typescript
function calculateSharpness(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const gray = convertToGrayscale(imageData);

  // Laplacian kernel
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
  // Normalize to 0-100 scale
  return Math.min((sharpness / 50) * 100, 100);
}
```

#### Noise Level Calculation

```typescript
function calculateNoiseLevel(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const gray = convertToGrayscale(imageData);

  // High-pass filter to detect noise
  let highFreqEnergy = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const center = gray[idx];

      // Calculate local variation
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
  // Normalize to 0-100 scale
  return Math.min((avgVariation / 30) * 100, 100);
}
```

---

### 6. Image Enhancement Algorithms

#### Apply Brightness Adjustment

```typescript
function applyBrightnessAdjustment(
  imageData: ImageData,
  adjustment: number // -100 to +100
): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + adjustment, 0, 255); // R
    data[i + 1] = clamp(data[i + 1] + adjustment, 0, 255); // G
    data[i + 2] = clamp(data[i + 2] + adjustment, 0, 255); // B
  }

  return imageData;
}
```

#### Apply Contrast Adjustment

```typescript
function applyContrastAdjustment(
  imageData: ImageData,
  factor: number // 0.5 to 2.0
): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp((data[i] - 128) * factor + 128, 0, 255); // R
    data[i + 1] = clamp((data[i + 1] - 128) * factor + 128, 0, 255); // G
    data[i + 2] = clamp((data[i + 2] - 128) * factor + 128, 0, 255); // B
  }

  return imageData;
}
```

#### Apply Sharpening Filter

```typescript
function applySharpen(
  imageData: ImageData,
  amount: number // 0-100
): ImageData {
  const intensity = amount / 100;
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // Sharpening kernel (strength adjusted by intensity)
  const center = 1 + 4 * intensity;
  const adjacent = -intensity;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        // RGB channels
        const idx = (y * width + x) * 4 + c;

        const sharpened =
          data[idx] * center +
          data[idx - 4] * adjacent + // left
          data[idx + 4] * adjacent + // right
          data[idx - width * 4] * adjacent + // top
          data[idx + width * 4] * adjacent; // bottom

        output.data[idx] = clamp(sharpened, 0, 255);
      }
      output.data[(y * width + x) * 4 + 3] = 255; // Alpha
    }
  }

  return output;
}
```

#### Apply Denoising Filter

```typescript
function applyDenoise(
  imageData: ImageData,
  strength: number // 0-100
): ImageData {
  const radius = Math.ceil((strength / 100) * 3); // 0-3 pixels
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // Gaussian blur for denoising
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;

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

      const outIdx = (y * width +
```
