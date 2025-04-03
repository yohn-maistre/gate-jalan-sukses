/**
 * LLM Integration Module
 * 
 * This module handles all interactions with the LLM (Google Gemini 2.5 Pro)
 * It provides functions for generating roadmaps, chat responses, and other LLM-powered features
 * 
 * NOTE: Currently using mock data for development. Replace with actual API calls when ready.
 */

interface LLMChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface LLMRoadmapGenerationParams {
  goal: string;
  userInfo: Record<string, string>;
}

interface LLMRoadmapResponse {
  title: string;
  goal: string;
  milestones: Array<{
    title: string;
    description: string;
    timeframe: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'link' | 'video' | 'document';
    }>;
  }>;
}

/**
 * Generate a chat response from the LLM
 * 
 * @param messages Previous messages in the conversation
 * @param roadmapGoal The user's current roadmap goal for context
 * @returns Promise with the LLM's response
 */
export async function generateChatResponse(
  messages: LLMChatMessage[],
  roadmapGoal?: string
): Promise<string> {
  // TODO: Replace with actual API call to Google Gemini 2.5 Pro
  console.log('Generating chat response with context:', { messages, roadmapGoal });
  
  // Mock response generation
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const mockResponses = [
    `Untuk mencapai tujuanmu "${roadmapGoal}", kamu perlu fokus pada langkah berikutnya. Teruslah berlatih dan belajar!`,
    "Jika kamu merasa kesulitan, ingatlah bahwa setiap orang sukses pernah mengalami kegagalan. Yang penting adalah terus bangkit.",
    "Bagus sekali progresmu sejauh ini! Teruslah konsisten dengan jadwal belajarmu.",
    "Mungkin kamu bisa mencari mentor atau komunitas yang bisa membantumu dalam perjalanan ini.",
    "Kamu bisa menggunakan resource yang sudah aku sediakan di roadmap untuk belajar lebih dalam."
  ];
  
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

/**
 * Generate a roadmap based on the user's goal and additional information
 * 
 * @param params Parameters for roadmap generation
 * @returns Promise with the generated roadmap
 */
export async function generateRoadmap(
  params: LLMRoadmapGenerationParams
): Promise<LLMRoadmapResponse> {
  // TODO: Replace with actual API call to Google Gemini 2.5 Pro
  console.log('Generating roadmap with params:', params);
  
  // Mock roadmap generation
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  
  // This is mock data - in a real app, this would come from the LLM
  return {
    title: `Roadmap untuk: ${params.goal}`,
    goal: params.goal,
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
  };
}

/**
 * Generate motivational messages for the user
 * 
 * @param roadmapGoal The user's current roadmap goal for context
 * @returns Promise with a motivational message
 */
export async function generateMotivationalMessage(roadmapGoal?: string): Promise<string> {
  // TODO: Replace with actual API call to Google Gemini 2.5 Pro
  console.log('Generating motivational message with context:', { roadmapGoal });
  
  // Mock message generation
  const messages = [
    "Kamu sedang on track untuk mencapai mimpimu!",
    "Setiap langkah kecil membawamu lebih dekat ke tujuan!",
    "Progress is progress, no matter how small.",
    "Teruslah melangkah, meskipun pelan!",
    `Perjalanan menuju ${roadmapGoal} memang tidak mudah, tapi kamu pasti bisa!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}