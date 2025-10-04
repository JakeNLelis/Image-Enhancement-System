import { FuzzyRule } from "@/types/fuzzy";

export const fuzzyRules: FuzzyRule[] = [
  {
    id: 1,
    if: [{ variable: "brightness", term: "VeryDark" }],
    then: [
      { variable: "brightnessAdj", term: "LargeIncrease" },
      { variable: "contrastAdj", term: "SmallIncrease" },
    ],
  },
  {
    id: 2,
    if: [
      { variable: "brightness", term: "VeryDark" },
      { variable: "contrast", term: "VeryLow" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeIncrease" },
      { variable: "contrastAdj", term: "LargeIncrease" },
    ],
  },
  {
    id: 3,
    if: [{ variable: "brightness", term: "Dark" }],
    then: [{ variable: "brightnessAdj", term: "SmallIncrease" }],
  },
  {
    id: 4,
    if: [
      { variable: "brightness", term: "Dark" },
      { variable: "contrast", term: "Low" },
    ],
    then: [{ variable: "contrastAdj", term: "SmallIncrease" }],
  },
  {
    id: 5,
    if: [
      { variable: "brightness", term: "Normal" },
      { variable: "contrast", term: "Medium" },
    ],
    then: [
      { variable: "brightnessAdj", term: "NoChange" },
      { variable: "contrastAdj", term: "NoChange" },
    ],
  },
  {
    id: 6,
    if: [{ variable: "brightness", term: "Bright" }],
    then: [{ variable: "brightnessAdj", term: "SmallDecrease" }],
  },
  {
    id: 7,
    if: [
      { variable: "brightness", term: "Bright" },
      { variable: "contrast", term: "High" },
    ],
    then: [{ variable: "contrastAdj", term: "SmallDecrease" }],
  },
  {
    id: 8,
    if: [{ variable: "brightness", term: "VeryBright" }],
    then: [
      { variable: "brightnessAdj", term: "LargeDecrease" },
      { variable: "contrastAdj", term: "SmallDecrease" },
    ],
  },
  {
    id: 9,
    if: [
      { variable: "brightness", term: "VeryBright" },
      { variable: "contrast", term: "VeryHigh" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeDecrease" },
      { variable: "contrastAdj", term: "LargeDecrease" },
    ],
  },
  {
    id: 10,
    if: [
      { variable: "contrast", term: "VeryLow" },
      { variable: "brightness", term: "Normal" },
    ],
    then: [{ variable: "contrastAdj", term: "LargeIncrease" }],
  },
  {
    id: 11,
    if: [
      { variable: "contrast", term: "VeryLow" },
      { variable: "brightness", term: "Dark" },
    ],
    then: [{ variable: "contrastAdj", term: "SmallIncrease" }],
  },
  {
    id: 12,
    if: [{ variable: "contrast", term: "Low" }],
    then: [{ variable: "contrastAdj", term: "SmallIncrease" }],
  },
  {
    id: 13,
    if: [
      { variable: "contrast", term: "Medium" },
      { variable: "brightness", term: "Normal" },
    ],
    then: [{ variable: "contrastAdj", term: "NoChange" }],
  },
  {
    id: 14,
    if: [
      { variable: "contrast", term: "High" },
      { variable: "brightness", term: "Bright" },
    ],
    then: [{ variable: "contrastAdj", term: "SmallDecrease" }],
  },
  {
    id: 15,
    if: [{ variable: "contrast", term: "High" }],
    then: [{ variable: "contrastAdj", term: "SmallDecrease" }],
  },
  {
    id: 16,
    if: [{ variable: "contrast", term: "VeryHigh" }],
    then: [{ variable: "contrastAdj", term: "LargeDecrease" }],
  },
  {
    id: 17,
    if: [
      { variable: "contrast", term: "VeryLow" },
      { variable: "sharpness", term: "VeryBlurry" },
    ],
    then: [
      { variable: "contrastAdj", term: "LargeIncrease" },
      { variable: "sharpen", term: "Medium" },
    ],
  },
  {
    id: 18,
    if: [
      { variable: "contrast", term: "Low" },
      { variable: "sharpness", term: "Blurry" },
    ],
    then: [{ variable: "sharpen", term: "Low" }],
  },
  {
    id: 19,
    if: [
      { variable: "sharpness", term: "VeryBlurry" },
      { variable: "noise", term: "Clean" },
    ],
    then: [{ variable: "sharpen", term: "VeryHigh" }],
  },
  {
    id: 20,
    if: [
      { variable: "sharpness", term: "VeryBlurry" },
      { variable: "noise", term: "Slight" },
    ],
    then: [
      { variable: "sharpen", term: "High" },
      { variable: "denoise", term: "Low" },
    ],
  },
  {
    id: 21,
    if: [
      { variable: "sharpness", term: "VeryBlurry" },
      { variable: "noise", term: "Moderate" },
    ],
    then: [
      { variable: "sharpen", term: "Medium" },
      { variable: "denoise", term: "Medium" },
    ],
  },
  {
    id: 22,
    if: [
      { variable: "sharpness", term: "Blurry" },
      { variable: "noise", term: "Clean" },
    ],
    then: [{ variable: "sharpen", term: "High" }],
  },
  {
    id: 23,
    if: [
      { variable: "sharpness", term: "Blurry" },
      { variable: "noise", term: "Slight" },
    ],
    then: [
      { variable: "sharpen", term: "Medium" },
      { variable: "denoise", term: "Low" },
    ],
  },
  {
    id: 24,
    if: [
      { variable: "sharpness", term: "Blurry" },
      { variable: "noise", term: "Moderate" },
    ],
    then: [
      { variable: "sharpen", term: "Low" },
      { variable: "denoise", term: "High" },
    ],
  },
  {
    id: 25,
    if: [
      { variable: "sharpness", term: "Acceptable" },
      { variable: "noise", term: "Clean" },
    ],
    then: [{ variable: "sharpen", term: "Low" }],
  },
  {
    id: 26,
    if: [
      { variable: "sharpness", term: "Acceptable" },
      { variable: "noise", term: "Slight" },
    ],
    then: [
      { variable: "sharpen", term: "None" },
      { variable: "denoise", term: "Low" },
    ],
  },
  {
    id: 27,
    if: [{ variable: "sharpness", term: "Sharp" }],
    then: [{ variable: "sharpen", term: "None" }],
  },
  {
    id: 28,
    if: [{ variable: "sharpness", term: "VerySharp" }],
    then: [{ variable: "sharpen", term: "None" }],
  },
  {
    id: 29,
    if: [
      { variable: "sharpness", term: "VerySharp" },
      { variable: "brightness", term: "VeryDark" },
    ],
    then: [{ variable: "brightnessAdj", term: "LargeIncrease" }],
  },
  {
    id: 30,
    if: [{ variable: "noise", term: "Clean" }],
    then: [{ variable: "denoise", term: "None" }],
  },
  {
    id: 31,
    if: [
      { variable: "noise", term: "Slight" },
      { variable: "sharpness", term: "Sharp" },
    ],
    then: [{ variable: "denoise", term: "Low" }],
  },
  {
    id: 32,
    if: [
      { variable: "noise", term: "Slight" },
      { variable: "sharpness", term: "Acceptable" },
    ],
    then: [{ variable: "denoise", term: "Low" }],
  },
  {
    id: 33,
    if: [
      { variable: "noise", term: "Slight" },
      { variable: "sharpness", term: "Blurry" },
    ],
    then: [{ variable: "denoise", term: "Medium" }],
  },
  {
    id: 34,
    if: [
      { variable: "noise", term: "Moderate" },
      { variable: "sharpness", term: "VerySharp" },
    ],
    then: [
      { variable: "denoise", term: "Medium" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 35,
    if: [
      { variable: "noise", term: "Moderate" },
      { variable: "sharpness", term: "Sharp" },
    ],
    then: [
      { variable: "denoise", term: "High" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 36,
    if: [{ variable: "noise", term: "Moderate" }],
    then: [{ variable: "denoise", term: "High" }],
  },
  {
    id: 37,
    if: [
      { variable: "noise", term: "Heavy" },
      { variable: "sharpness", term: "VeryBlurry" },
    ],
    then: [
      { variable: "denoise", term: "VeryHigh" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 38,
    if: [{ variable: "noise", term: "Heavy" }],
    then: [
      { variable: "denoise", term: "VeryHigh" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 39,
    if: [
      { variable: "brightness", term: "Normal" },
      { variable: "contrast", term: "Medium" },
      { variable: "sharpness", term: "Sharp" },
      { variable: "noise", term: "Clean" },
    ],
    then: [
      { variable: "brightnessAdj", term: "NoChange" },
      { variable: "contrastAdj", term: "NoChange" },
      { variable: "sharpen", term: "None" },
      { variable: "denoise", term: "None" },
    ],
  },
  {
    id: 40,
    if: [
      { variable: "brightness", term: "VeryDark" },
      { variable: "contrast", term: "VeryLow" },
      { variable: "sharpness", term: "VeryBlurry" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeIncrease" },
      { variable: "contrastAdj", term: "LargeIncrease" },
      { variable: "sharpen", term: "Medium" },
    ],
  },
  {
    id: 41,
    if: [
      { variable: "brightness", term: "VeryBright" },
      { variable: "contrast", term: "VeryHigh" },
      { variable: "sharpness", term: "VerySharp" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeDecrease" },
      { variable: "contrastAdj", term: "LargeDecrease" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 42,
    if: [
      { variable: "contrast", term: "VeryLow" },
      { variable: "sharpness", term: "VeryBlurry" },
      { variable: "noise", term: "Heavy" },
    ],
    then: [
      { variable: "contrastAdj", term: "SmallIncrease" },
      { variable: "sharpen", term: "None" },
      { variable: "denoise", term: "VeryHigh" },
    ],
  },
  {
    id: 43,
    if: [
      { variable: "brightness", term: "Dark" },
      { variable: "contrast", term: "Low" },
      { variable: "noise", term: "Moderate" },
    ],
    then: [
      { variable: "brightnessAdj", term: "SmallIncrease" },
      { variable: "contrastAdj", term: "SmallIncrease" },
      { variable: "denoise", term: "Medium" },
    ],
  },
  {
    id: 44,
    if: [
      { variable: "brightness", term: "Bright" },
      { variable: "sharpness", term: "Blurry" },
      { variable: "noise", term: "Slight" },
    ],
    then: [
      { variable: "brightnessAdj", term: "SmallDecrease" },
      { variable: "sharpen", term: "Medium" },
      { variable: "denoise", term: "Low" },
    ],
  },
  {
    id: 45,
    if: [
      { variable: "contrast", term: "High" },
      { variable: "sharpness", term: "VerySharp" },
      { variable: "noise", term: "Clean" },
    ],
    then: [
      { variable: "contrastAdj", term: "SmallDecrease" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 46,
    if: [
      { variable: "brightness", term: "VeryDark" },
      { variable: "noise", term: "Heavy" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeIncrease" },
      { variable: "denoise", term: "VeryHigh" },
      { variable: "sharpen", term: "None" },
    ],
  },
  {
    id: 47,
    if: [
      { variable: "brightness", term: "VeryBright" },
      { variable: "contrast", term: "VeryLow" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeDecrease" },
      { variable: "contrastAdj", term: "LargeIncrease" },
    ],
  },
  {
    id: 48,
    if: [
      { variable: "brightness", term: "VeryDark" },
      { variable: "contrast", term: "VeryHigh" },
    ],
    then: [
      { variable: "brightnessAdj", term: "LargeIncrease" },
      { variable: "contrastAdj", term: "SmallDecrease" },
    ],
  },
  {
    id: 49,
    if: [
      { variable: "sharpness", term: "VeryBlurry" },
      { variable: "noise", term: "Heavy" },
      { variable: "contrast", term: "VeryLow" },
    ],
    then: [
      { variable: "denoise", term: "VeryHigh" },
      { variable: "sharpen", term: "None" },
      { variable: "contrastAdj", term: "SmallIncrease" },
    ],
  },
  {
    id: 50,
    if: [
      { variable: "brightness", term: "Normal" },
      { variable: "contrast", term: "Medium" },
      { variable: "sharpness", term: "Blurry" },
      { variable: "noise", term: "Moderate" },
    ],
    then: [
      { variable: "sharpen", term: "None" },
      { variable: "denoise", term: "High" },
    ],
  },
];
