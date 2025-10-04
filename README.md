# Intelligent Image Quality Enhancer using Fuzzy Logic System

A sophisticated web-based image enhancement application built with Next.js 15 that automatically improves image quality through fuzzy logic inference. The system analyzes uploaded images to extract quality metrics and applies intelligent enhancement parameters determined by a comprehensive fuzzy inference system.

## 🚀 Features

### Core Functionality

- **Smart Image Analysis**: Automatically extracts brightness, contrast, sharpness, and noise level metrics
- **Fuzzy Logic Engine**: Implements complete Mamdani inference with 50 comprehensive rules
- **Automatic Enhancement**: Applies brightness adjustment, contrast enhancement, sharpening, and denoising
- **Real-time Visualization**: Interactive charts showing membership functions and rule firing
- **Before/After Comparison**: Side-by-side comparison with quality metrics improvement tracking

### Technical Features

- **Client-side Processing**: No server required - all processing happens in the browser
- **Multiple Image Formats**: Support for JPEG, PNG, and WebP formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Educational Dashboard**: Shows the complete fuzzy reasoning process step-by-step
- **Download Enhanced Images**: Save processed images to your device

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Image Processing**: HTML Canvas API
- **Charting**: Recharts
- **State Management**: React useState hooks

## 📋 System Requirements

- Node.js 18.0 or later
- Modern web browser with Canvas API support
- 4GB RAM (for processing large images)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

```bash
   git clone git@github.com:JakeNLelis/Image-Enhancement-System.git
   cd image_enhancement_system
```

2. **Install dependencies**

```bash
   npm install
```

3. **Start the development server**

```bash
   npm run dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
   npm run dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

````bash
   ```bash
   npm run dev
````

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🧠 Fuzzy Logic System

### Input Variables

1. **Brightness** (0-255): Average pixel luminosity
2. **Contrast** (0-100): Standard deviation of pixel intensities (normalized)
3. **Sharpness** (0-100): Edge detection strength using Laplacian variance
4. **Noise Level** (0-100): High-frequency component intensity

### Output Variables

1. **Brightness Adjustment** (-100 to +100): Amount to add/subtract from pixel values
2. **Contrast Adjustment** (0.5 to 2.0): Multiplier for pixel deviation from mean
3. **Sharpen Amount** (0-100): Intensity of sharpening filter application
4. **Denoise Strength** (0-100): Intensity of noise reduction filter

### Inference Process

1. **Fuzzification**: Convert crisp input values to fuzzy membership degrees
2. **Rule Evaluation**: Apply 50 comprehensive fuzzy rules with AND operations
3. **Implication**: Use minimum implication method to clip output functions
4. **Aggregation**: Combine outputs using maximum operator
5. **Defuzzification**: Apply centroid method to get crisp output values

## 📊 Fuzzy Rules Overview

The system implements 50 carefully designed rules covering:

- **Brightness Enhancement Rules** (Rules 1-9): Handle very dark to very bright images
- **Contrast Enhancement Rules** (Rules 10-18): Optimize contrast based on brightness and sharpness
- **Sharpness Enhancement Rules** (Rules 19-29): Balance sharpening with noise levels
- **Noise Reduction Rules** (Rules 30-38): Reduce noise while preserving sharpness
- **Combined Quality Rules** (Rules 39-46): Handle complex multi-variable scenarios
- **Edge Case Rules** (Rules 47-50): Address unusual image characteristics

## 🎯 Usage Guide

### Step 1: Upload & Analyze

1. Upload an image using drag-and-drop or file selector
2. Wait for automatic analysis to extract quality metrics
3. Review the linguistic interpretation of image characteristics

### Step 2: Fuzzy Processing

1. Navigate to the "Fuzzy Processing" tab
2. Watch the real-time fuzzy inference process
3. Explore the comprehensive visualization dashboard

### Step 3: View Results

1. Check the "Results" tab for enhancement parameters
2. Review the processing summary and statistics
3. Understand which rules were activated and why

### Step 4: Compare Results

1. View side-by-side comparison in the "Comparison" tab
2. See quantitative improvements in image metrics
3. Download the enhanced image

## 🔧 Algorithm Details

### Image Analysis Algorithms

#### Brightness Calculation

```typescript
brightness = Σ(0.299 * R + 0.587 * G + 0.114 * B) / totalPixels;
```

#### Contrast Calculation

```typescript
contrast = (standardDeviation(grayValues) / 128) * 100;
```

#### Sharpness Calculation (Laplacian Variance)

```typescript
sharpness = variance(laplacianFilter(image)) normalized to 0-100
```

#### Noise Level Calculation

```typescript
noise = averageLocalVariation(highFrequencyComponents) normalized to 0-100
```

### Enhancement Algorithms

- **Brightness Adjustment**: Direct pixel value modification
- **Contrast Adjustment**: Deviation amplification from mean
- **Sharpening**: Convolution with sharpening kernel
- **Denoising**: Gaussian blur with adaptive radius

## 📈 Performance Considerations

- **Image Size**: Automatically resizes large images to optimize processing speed
- **Memory Usage**: Efficient canvas operations to minimize memory footprint
- **Processing Time**: Typical enhancement takes 1-3 seconds for standard images
- **Browser Compatibility**: Tested on Chrome, Firefox, Safari, and Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Fuzzy logic implementation based on Mamdani inference system
- Image processing algorithms adapted from computer vision literature
- UI components from shadcn/ui library
- Visualization powered by Recharts library

## 📞 Support

For support, feature requests, or bug reports, please open an issue on the GitHub repository.

---

**Built with ❤️ using fuzzy logic and modern web technologies**
