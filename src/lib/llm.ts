
/**
 * LLM Integration Module
 * 
 * This module handles all interactions with the LLM (Google Gemini 2.5 Pro)
 * It provides functions for generating roadmaps, chat responses, and other LLM-powered features
 */

import { useRoadmapGenerator } from "@/services/roadmap-generator";
import { useModelConfig } from "@/contexts/ModelConfigContext";

export interface LLMChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMRoadmapGenerationParams {
  goal: string;
  userInfo: Record<string, string>;
}

export interface LLMRoadmapResponse {
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
  const { generateChatResponse } = useRoadmapGenerator();
  return generateChatResponse(messages, roadmapGoal);
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
  const { generateRoadmap } = useRoadmapGenerator();
  return generateRoadmap(params);
}

/**
 * Generate motivational messages for the user
 * 
 * @param roadmapGoal The user's current roadmap goal for context
 * @returns Promise with a motivational message
 */
export async function generateMotivationalMessage(roadmapGoal?: string): Promise<string> {
  const { generateMotivationalMessage } = useRoadmapGenerator();
  return generateMotivationalMessage(roadmapGoal);
}
