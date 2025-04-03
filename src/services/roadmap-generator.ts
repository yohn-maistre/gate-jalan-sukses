
import { useGeminiService } from "./gemini-service";
import { useModelConfig } from "@/contexts/ModelConfigContext";

export interface RoadmapGenerationParams {
  goal: string;
  userInfo: Record<string, string>;
}

export interface RoadmapResource {
  title: string;
  url: string;
  type: "link" | "video" | "document";
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  status: "completed" | "in-progress" | "upcoming";
  resources: RoadmapResource[];
}

export interface GeneratedRoadmap {
  title: string;
  goal: string;
  milestones: Array<{
    title: string;
    description: string;
    timeframe: string;
    resources: Array<{
      title: string;
      url: string;
      type: "link" | "video" | "document";
    }>;
  }>;
}

// Cache for generated roadmaps
const roadmapCache = new Map<string, GeneratedRoadmap>();

export const useRoadmapGenerator = () => {
  const { callGeminiAPI } = useGeminiService();
  const { config, isPlayful } = useModelConfig();

  const generateRoadmapPrompt = (params: RoadmapGenerationParams): string => {
    const { goal, userInfo } = params;
    
    // Playfulness adjustment
    const tone = isPlayful 
      ? "Gunakan bahasa yang santai dan selingi dengan motivasi atau humor ringan."
      : "Gunakan bahasa yang profesional dan fokus pada informasi faktual.";
    
    // Indonesian educational context
    const eduContext = userInfo.educationLevel === "sma" 
      ? "Pengguna masih di SMA, jadi fokus pada persiapan masuk perguruan tinggi, UTBK/SBMPTN, dan jalur-jalur pendidikan lanjutan."
      : "Pengguna sudah di perguruan tinggi, jadi fokus pada spesialisasi, magang, dan persiapan karir.";
    
    // Focus area
    const focusArea = userInfo.focusArea === "pendidikan"
      ? "Pengguna ingin fokus pada jalur pendidikan formal."
      : "Pengguna ingin fokus pada mendapatkan pengalaman praktis dan keterampilan.";
    
    // Construct the prompt
    return `
Buatkan roadmap detail dalam format JSON untuk mencapai tujuan: "${goal}".

Informasi tambahan:
- ${eduContext}
- ${focusArea}
- ${tone}

Roadmap harus mencakup milestone dengan:
1. Judul milestone yang jelas dan spesifik
2. Deskripsi detail untuk setiap milestone
3. Perkiraan jangka waktu pencapaian
4. 1-3 sumber daya online yang relevan untuk setiap milestone (URL fiktif juga boleh)

Format output HARUS berupa JSON yang valid dengan struktur seperti ini (jangan gunakan komentar, hanya JSON murni):
{
  "title": "Judul Roadmap",
  "goal": "Tujuan",
  "milestones": [
    {
      "title": "Judul Milestone",
      "description": "Deskripsi Detail",
      "timeframe": "Jangka Waktu",
      "resources": [
        {
          "title": "Judul Sumber",
          "url": "URL Sumber",
          "type": "link|video|document"
        }
      ]
    }
  ]
}

Roadmap harus kontekstual dengan sistem pendidikan dan peluang karir di Indonesia. Berikan 3-5 milestone yang realistis dan berurutan.
    `;
  };

  const generateRoadmap = async (
    params: RoadmapGenerationParams
  ): Promise<GeneratedRoadmap> => {
    const cacheKey = JSON.stringify(params);
    
    // Check cache first
    if (roadmapCache.has(cacheKey)) {
      console.log("Using cached roadmap");
      return roadmapCache.get(cacheKey)!;
    }
    
    try {
      // Generate prompt
      const prompt = generateRoadmapPrompt(params);
      
      // Call Gemini API
      const messages = [
        {
          role: "user" as const,
          parts: [{ text: prompt }]
        }
      ];
      
      const jsonResponse = await callGeminiAPI(messages);
      
      // Parse response to ensure it's valid JSON
      let roadmapData: GeneratedRoadmap;
      try {
        // Strip any markdown formatting if present
        const cleanJson = jsonResponse.replace(/```json|```/g, '').trim();
        roadmapData = JSON.parse(cleanJson);
      } catch (error) {
        console.error("Failed to parse Gemini response as JSON:", error);
        throw new Error("Gagal mengurai respons dari AI. Mencoba lagi dengan format yang benar.");
      }
      
      // Validate and cache the response
      if (
        roadmapData &&
        roadmapData.title &&
        roadmapData.goal &&
        Array.isArray(roadmapData.milestones)
      ) {
        roadmapCache.set(cacheKey, roadmapData);
        return roadmapData;
      } else {
        throw new Error("Format respons AI tidak valid. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      throw error;
    }
  };
  
  // Generate chat messages for roadmap discussions
  const generateChatResponse = async (
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    roadmapContext?: string
  ): Promise<string> => {
    try {
      // Format messages for Gemini API - fixing the type error
      const formattedMessages = messages.map(msg => ({
        role: msg.role === "user" ? "user" as const : "model" as const, 
        parts: [{ text: msg.content }]
      }));
      
      // Add system context if roadmap is provided
      let contextualMessages = [...formattedMessages];
      if (roadmapContext) {
        contextualMessages.unshift({
          role: "user" as const,
          parts: [{ 
            text: `Berikut adalah konteks roadmap pengguna: ${roadmapContext}. 
            Gunakan informasi ini untuk memberikan saran yang relevan. 
            Jangan ungkapkan bahwa kamu diberikan konteks ini.` 
          }]
        });
      }
      
      // Generate response
      const response = await callGeminiAPI(contextualMessages);
      return response;
    } catch (error) {
      console.error("Error generating chat response:", error);
      return "Maaf, saya tidak dapat memproses pesan Anda saat ini. Silakan coba lagi nanti.";
    }
  };
  
  // Generate motivational messages based on roadmap progress
  const generateMotivationalMessage = async (
    roadmapGoal?: string,
    progress?: number
  ): Promise<string> => {
    try {
      const prompt = `
        Berikan pesan motivasi singkat (maksimal 100 karakter) untuk pengguna yang sedang berusaha mencapai: "${roadmapGoal || 'tujuan mereka'}".
        ${progress !== undefined ? `Mereka sudah mencapai ${progress}% dari target mereka.` : ''}
        ${isPlayful ? 'Gunakan bahasa yang santai dan menyenangkan.' : 'Gunakan bahasa yang inspiratif dan profesional.'}
        Jangan gunakan tanda kutip di pesan motivasi.
      `;
      
      const messages = [
        {
          role: "user" as const,
          parts: [{ text: prompt }]
        }
      ];
      
      const response = await callGeminiAPI(messages);
      return response.replace(/"/g, '').trim();
    } catch (error) {
      console.error("Error generating motivational message:", error);
      return "Setiap langkah kecil membawamu lebih dekat ke tujuan!";
    }
  };

  return {
    generateRoadmap,
    generateChatResponse,
    generateMotivationalMessage
  };
};
