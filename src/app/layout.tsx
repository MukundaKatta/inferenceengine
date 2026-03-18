import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "InferenceEngine — Local Inference Management", description: "Quantization browser, memory estimator, benchmarks, and model format converter" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="dark"><body className="bg-gray-950 text-gray-100 antialiased">{children}</body></html>;
}
