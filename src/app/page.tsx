"use client";

import { useState } from "react";
import { Cpu, BarChart3, HardDrive, ArrowRightLeft, Gauge, Calculator, Layers, Settings } from "lucide-react";

type Tab = "quantization" | "memory" | "benchmarks" | "converter";

interface QuantLevel {
  name: string;
  bits: number;
  ratio: number;
  quality: number;
  speed: number;
  description: string;
}

interface ModelEstimate {
  model: string;
  params: string;
  fp16: number;
  q8: number;
  q4: number;
  q2: number;
}

const quantLevels: QuantLevel[] = [
  { name: "FP32", bits: 32, ratio: 1.0, quality: 100, speed: 40, description: "Full precision, baseline quality" },
  { name: "FP16", bits: 16, ratio: 0.5, quality: 99.8, speed: 65, description: "Half precision, negligible quality loss" },
  { name: "Q8_0", bits: 8, ratio: 0.25, quality: 99.2, speed: 80, description: "8-bit quantization, excellent quality" },
  { name: "Q6_K", bits: 6, ratio: 0.19, quality: 98.5, speed: 85, description: "6-bit k-quant, great balance" },
  { name: "Q5_K_M", bits: 5, ratio: 0.16, quality: 97.8, speed: 88, description: "5-bit k-quant medium, recommended" },
  { name: "Q4_K_M", bits: 4, ratio: 0.125, quality: 96.5, speed: 92, description: "4-bit k-quant medium, most popular" },
  { name: "Q4_0", bits: 4, ratio: 0.125, quality: 95.0, speed: 95, description: "4-bit basic quant, fast" },
  { name: "Q3_K_M", bits: 3, ratio: 0.094, quality: 93.0, speed: 96, description: "3-bit k-quant, noticeable quality drop" },
  { name: "Q2_K", bits: 2, ratio: 0.063, quality: 85.0, speed: 98, description: "2-bit k-quant, significant quality loss" },
  { name: "IQ2_XXS", bits: 2, ratio: 0.055, quality: 82.0, speed: 100, description: "Importance-weighted 2-bit, experimental" },
];

const modelEstimates: ModelEstimate[] = [
  { model: "LLaMA 3 8B", params: "8B", fp16: 16, q8: 8.5, q4: 4.8, q2: 3.2 },
  { model: "LLaMA 3 70B", params: "70B", fp16: 140, q8: 74, q4: 38.5, q2: 25 },
  { model: "Mistral 7B", params: "7.3B", fp16: 14.6, q8: 7.7, q4: 4.2, q2: 2.8 },
  { model: "Mixtral 8x7B", params: "46.7B", fp16: 93.4, q8: 49, q4: 26, q2: 17 },
  { model: "Phi-3 Mini", params: "3.8B", fp16: 7.6, q8: 4.0, q4: 2.2, q2: 1.5 },
  { model: "CodeLlama 34B", params: "34B", fp16: 68, q8: 36, q4: 19, q2: 12.5 },
  { model: "Gemma 2 27B", params: "27B", fp16: 54, q8: 28.5, q4: 15, q2: 10 },
];

const benchmarkData = [
  { model: "LLaMA 3 8B Q4", gpu: "RTX 4090", tps: 120, ttft: 45, memory: 5.2 },
  { model: "LLaMA 3 8B Q4", gpu: "RTX 3090", tps: 85, ttft: 62, memory: 5.2 },
  { model: "LLaMA 3 8B Q4", gpu: "M4 Max", tps: 42, ttft: 38, memory: 4.8 },
  { model: "LLaMA 3 8B Q4", gpu: "CPU (32-core)", tps: 12, ttft: 250, memory: 5.2 },
  { model: "LLaMA 3 70B Q4", gpu: "RTX 4090", tps: 18, ttft: 320, memory: 40 },
  { model: "LLaMA 3 70B Q4", gpu: "2x RTX 4090", tps: 35, ttft: 180, memory: 40 },
  { model: "Mistral 7B Q4", gpu: "RTX 4090", tps: 135, ttft: 38, memory: 4.5 },
  { model: "Mistral 7B Q4", gpu: "M4 Max", tps: 48, ttft: 32, memory: 4.2 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("quantization");
  const [selectedQuant, setSelectedQuant] = useState("Q4_K_M");
  const [memoryAvailable, setMemoryAvailable] = useState(24);
  const [contextLength, setContextLength] = useState(4096);

  const tabs: { key: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { key: "quantization", icon: Layers, label: "Quantization" },
    { key: "memory", icon: Calculator, label: "Memory Estimator" },
    { key: "benchmarks", icon: Gauge, label: "Benchmarks" },
    { key: "converter", icon: ArrowRightLeft, label: "Format Converter" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Cpu size={20} className="text-brand-400" />
            <h1 className="text-lg font-bold">InferenceEngine</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Local Inference Manager</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.key ? "bg-brand-600/20 text-brand-400" : "text-gray-400 hover:bg-gray-800"}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === "quantization" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Quantization Browser</h2>
            <div className="space-y-3">
              {quantLevels.map((q) => (
                <div key={q.name} onClick={() => setSelectedQuant(q.name)}
                  className={`bg-gray-900 border rounded-xl p-5 cursor-pointer transition-colors ${selectedQuant === q.name ? "border-brand-500" : "border-gray-800 hover:border-gray-700"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-brand-400">{q.name}</span>
                      <span className="text-sm text-gray-500">{q.bits}-bit</span>
                    </div>
                    <span className="text-sm text-gray-500">{(q.ratio * 100).toFixed(1)}% of FP32 size</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{q.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-500">Quality</span><span>{q.quality}%</span></div>
                      <div className="bg-gray-800 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: `${q.quality}%` }} /></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-500">Speed</span><span>{q.speed}%</span></div>
                      <div className="bg-gray-800 rounded-full h-2"><div className="bg-brand-500 rounded-full h-2" style={{ width: `${q.speed}%` }} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "memory" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Memory Estimator</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <label className="block text-sm text-gray-400 mb-2">Available Memory (GB)</label>
                <input type="number" value={memoryAvailable} onChange={(e) => setMemoryAvailable(parseInt(e.target.value) || 0)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <label className="block text-sm text-gray-400 mb-2">Context Length</label>
                <select value={contextLength} onChange={(e) => setContextLength(parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                  <option value={2048}>2,048</option>
                  <option value={4096}>4,096</option>
                  <option value={8192}>8,192</option>
                  <option value={16384}>16,384</option>
                  <option value={32768}>32,768</option>
                  <option value={65536}>65,536</option>
                  <option value={131072}>131,072</option>
                </select>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <label className="block text-sm text-gray-400 mb-2">KV Cache Overhead</label>
                <p className="text-lg font-bold text-brand-400">{(contextLength * 0.0005).toFixed(1)} GB</p>
                <p className="text-xs text-gray-500 mt-1">Estimated for 32 layers</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left px-4 py-3">Model</th>
                    <th className="text-right px-4 py-3">Params</th>
                    <th className="text-right px-4 py-3">FP16</th>
                    <th className="text-right px-4 py-3">Q8</th>
                    <th className="text-right px-4 py-3">Q4</th>
                    <th className="text-right px-4 py-3">Q2</th>
                    <th className="text-center px-4 py-3">Fits?</th>
                  </tr>
                </thead>
                <tbody>
                  {modelEstimates.map((m) => (
                    <tr key={m.model} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-medium">{m.model}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{m.params}</td>
                      <td className={`px-4 py-3 text-right ${m.fp16 <= memoryAvailable ? "text-green-400" : "text-red-400"}`}>{m.fp16} GB</td>
                      <td className={`px-4 py-3 text-right ${m.q8 <= memoryAvailable ? "text-green-400" : "text-red-400"}`}>{m.q8} GB</td>
                      <td className={`px-4 py-3 text-right ${m.q4 <= memoryAvailable ? "text-green-400" : "text-red-400"}`}>{m.q4} GB</td>
                      <td className={`px-4 py-3 text-right ${m.q2 <= memoryAvailable ? "text-green-400" : "text-red-400"}`}>{m.q2} GB</td>
                      <td className="px-4 py-3 text-center">
                        {m.q4 <= memoryAvailable ? <span className="text-green-400">Q4+</span> :
                         m.q2 <= memoryAvailable ? <span className="text-yellow-400">Q2 only</span> :
                         <span className="text-red-400">No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "benchmarks" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Benchmark Comparison</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left px-4 py-3">Model</th>
                    <th className="text-left px-4 py-3">Hardware</th>
                    <th className="text-right px-4 py-3">Tokens/sec</th>
                    <th className="text-right px-4 py-3">TTFT (ms)</th>
                    <th className="text-right px-4 py-3">Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkData.map((b, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-medium">{b.model}</td>
                      <td className="px-4 py-3 text-brand-400">{b.gpu}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-2">
                            <div className="bg-brand-500 rounded-full h-2" style={{ width: `${Math.min((b.tps / 140) * 100, 100)}%` }} />
                          </div>
                          <span className="font-medium">{b.tps}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">{b.ttft}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{b.memory} GB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "converter" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Model Format Converter</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="font-medium">Convert Model Format</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Source Format</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option>PyTorch (.pt / .bin)</option>
                    <option>SafeTensors (.safetensors)</option>
                    <option>GGUF (.gguf)</option>
                    <option>GGML (.ggml)</option>
                    <option>ONNX (.onnx)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Target Format</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option>GGUF (.gguf)</option>
                    <option>SafeTensors (.safetensors)</option>
                    <option>ONNX (.onnx)</option>
                    <option>Core ML (.mlpackage)</option>
                    <option>TensorRT (.engine)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantization (optional)</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="">None (keep original)</option>
                    {quantLevels.map((q) => <option key={q.name} value={q.name}>{q.name} ({q.bits}-bit)</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Model Path</label>
                  <input placeholder="/path/to/model or HuggingFace ID" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button className="w-full bg-brand-600 hover:bg-brand-700 py-2.5 rounded-lg text-sm font-medium">Start Conversion</button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-medium mb-4">Format Comparison</h3>
                <div className="space-y-3">
                  {[
                    { format: "GGUF", pros: "Best for CPU/hybrid inference, wide quantization support", cons: "Larger file sizes at FP16" },
                    { format: "SafeTensors", pros: "Fast loading, safe (no arbitrary code), HF standard", cons: "No built-in quantization" },
                    { format: "ONNX", pros: "Universal format, hardware agnostic", cons: "Complex for LLMs, limited quant" },
                    { format: "TensorRT", pros: "Fastest NVIDIA inference", cons: "NVIDIA-only, complex setup" },
                    { format: "Core ML", pros: "Apple Silicon optimized", cons: "Apple-only" },
                  ].map((fmt) => (
                    <div key={fmt.format} className="bg-gray-800 rounded-lg p-3">
                      <p className="font-medium text-sm text-brand-400">{fmt.format}</p>
                      <p className="text-xs text-green-400 mt-1">+ {fmt.pros}</p>
                      <p className="text-xs text-red-400">- {fmt.cons}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
