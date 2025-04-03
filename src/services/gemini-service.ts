
import { useModelConfig } from "@/contexts/ModelConfigContext";

// API endpoints
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY";

// Error types
export class GeminiServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

export class GeminiNetworkError extends GeminiServiceError {
  constructor(message: string) {
    super(message);
    this.name = "GeminiNetworkError";
  }
}

export class GeminiRateLimitError extends GeminiServiceError {
  constructor(message: string) {
    super(message);
    this.name = "GeminiRateLimitError";
  }
}

// Type definitions
interface GeminiRequestOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiChatMessage {
  role: "user" | "model";
  parts: Array<{
    text: string;
  }>;
}

interface GeminiChatRequest {
  contents: GeminiChatMessage[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Mock API for development/fallback
const mockGeminiResponse = (prompt: string): Promise<string> => {
  console.log("Using mock Gemini response for:", prompt);
  return new Promise(resolve => {
    setTimeout(() => {
      if (prompt.includes("dokter")) {
        resolve(JSON.stringify({
          title: "Roadmap untuk: Menjadi Dokter",
          goal: "Menjadi dokter yang kompeten dan berlisensi di Indonesia",
          milestones: [
            {
              title: "Lulus SMA dengan Nilai Bagus",
              description: "Fokus pada mata pelajaran Biologi, Kimia, dan Matematika untuk persiapan masuk Kedokteran",
              timeframe: "6 Bulan",
              resources: [
                {
                  title: "Panduan SBMPTN 2025",
                  url: "https://example.com/sbmptn",
                  type: "link"
                },
                {
                  title: "Video Pembelajaran Biologi",
                  url: "https://example.com/biologi",
                  type: "video"
                }
              ]
            },
            {
              title: "Persiapan UTBK/SBMPTN",
              description: "Ikuti bimbel dan latihan soal untuk persiapan ujian masuk",
              timeframe: "1 Tahun",
              resources: [
                {
                  title: "Kursus Online UTBK/SBMPTN",
                  url: "https://example.com/kursus",
                  type: "link"
                }
              ]
            },
            {
              title: "Masuk Fakultas Kedokteran",
              description: "Persiapkan dokumen pendaftaran dan materi ujian masuk",
              timeframe: "1.5 Tahun",
              resources: [
                {
                  title: "Daftar Beasiswa Kedokteran",
                  url: "https://example.com/beasiswa",
                  type: "document"
                }
              ]
            }
          ]
        }));
      } else if (prompt.includes("engineer") || prompt.includes("programmer")) {
        resolve(JSON.stringify({
          title: "Roadmap untuk: Menjadi Software Engineer",
          goal: "Menjadi software engineer profesional",
          milestones: [
            {
              title: "Mempelajari Dasar Pemrograman",
              description: "Kuasai dasar-dasar algoritma dan pemrograman",
              timeframe: "3 Bulan",
              resources: [
                {
                  title: "Belajar Coding dari Dicoding",
                  url: "https://www.dicoding.com",
                  type: "link"
                }
              ]
            },
            {
              title: "Mengerjakan Proyek Portfolio",
              description: "Buat 3-5 proyek untuk portofolio pribadi",
              timeframe: "6 Bulan",
              resources: [
                {
                  title: "GitHub Student Pack",
                  url: "https://education.github.com/pack",
                  type: "link"
                }
              ]
            }
          ]
        }));
      } else {
        resolve(JSON.stringify({
          title: `Roadmap untuk: ${prompt}`,
          goal: prompt,
          milestones: [
            {
              title: "Definisikan Tujuan Spesifik",
              description: "Tentukan apa yang ingin kamu capai secara detail",
              timeframe: "1 Bulan",
              resources: [
                {
                  title: "Template Goal Setting",
                  url: "https://example.com/goals",
                  type: "document"
                }
              ]
            },
            {
              title: "Kembangkan Keterampilan Dasar",
              description: "Kuasai keterampilan fundamental yang dibutuhkan",
              timeframe: "6 Bulan",
              resources: [
                {
                  title: "Kursus Online Terbaik",
                  url: "https://example.com/courses",
                  type: "link"
                }
              ]
            }
          ]
        }));
      }
    }, 1500);
  });
};

// Main service functions
export const useGeminiService = () => {
  const { config, isPlayful } = useModelConfig();
  
  // Function to call Gemini API
  const callGeminiAPI = async (
    messages: GeminiChatMessage[],
    options: GeminiRequestOptions = {}
  ): Promise<string> => {
    try {
      // Check for network connectivity
      if (!navigator.onLine) {
        throw new GeminiNetworkError("Tidak ada koneksi internet. Menggunakan data offline.");
      }

      // Default options
      const defaultOptions: GeminiRequestOptions = {
        model: config.model,
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens
      };

      // Merge options
      const mergedOptions = { ...defaultOptions, ...options };
      
      const requestBody: GeminiChatRequest = {
        contents: messages,
        generationConfig: {
          temperature: mergedOptions.temperature!,
          maxOutputTokens: mergedOptions.maxOutputTokens!
        }
      };

      // For development, use mock responses
      if (process.env.NODE_ENV === 'development' && !API_KEY.includes("YOUR_API")) {
        return mockGeminiResponse(messages[messages.length - 1].parts[0].text);
      }

      // Make API request
      const response = await fetch(
        `${GEMINI_API_URL}/${mergedOptions.model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );

      // Handle error responses
      if (!response.ok) {
        if (response.status === 429) {
          throw new GeminiRateLimitError("Batas API terlampaui. Coba lagi nanti.");
        }
        
        const errorData = await response.json();
        throw new GeminiServiceError(
          errorData.error?.message || "Error saat menghubungi Gemini API"
        );
      }

      // Parse successful response
      const data = await response.json() as GeminiResponse;
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new GeminiServiceError("Tidak ada respons dari Gemini API");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // Fall back to mock responses for development or when API fails
      if (
        error instanceof GeminiNetworkError || 
        error instanceof GeminiRateLimitError ||
        process.env.NODE_ENV === 'development'
      ) {
        console.log("Falling back to mock response");
        return mockGeminiResponse(messages[messages.length - 1].parts[0].text);
      }
      
      throw error;
    }
  };

  return { callGeminiAPI };
};
