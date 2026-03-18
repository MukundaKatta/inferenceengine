# InferenceEngine

> Local LLM inference manager with quantization browser, memory estimator, hardware benchmarks, and model format converter.

## Features

- **Quantization Browser** -- Compare 10+ quantization levels (FP32 to IQ2_XXS) with quality/speed trade-off visualizations
- **Memory Estimator** -- Calculate memory requirements for popular models (LLaMA 3, Mistral, Mixtral, Phi-3, etc.) across quantization levels with fit-check indicators
- **Benchmark Comparison** -- Tokens/sec, TTFT, and memory usage benchmarks across GPUs (RTX 4090, RTX 3090, M4 Max, CPU)
- **Model Format Converter** -- Convert between PyTorch, SafeTensors, GGUF, GGML, ONNX, Core ML, and TensorRT formats
- **Format Comparison Guide** -- Pros and cons for each model format with use-case recommendations
- **Context Length Calculator** -- KV cache overhead estimation for various context lengths

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | Next.js 14 (App Router)             |
| Language  | TypeScript                          |
| UI        | Tailwind CSS, Lucide React          |
| Charts    | Recharts                            |
| State     | Zustand                             |
| Backend   | Supabase (Auth + Database)          |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
inferenceengine/
├── src/
│   └── app/
│       └── page.tsx          # Full app with quantization, memory, benchmarks,
│                             # and converter tabs
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

