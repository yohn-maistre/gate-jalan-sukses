
# Jalan Sukses - LLM Implementation Documentation

## Overview
Jalan Sukses uses Google Gemini Pro 2.5 to power its roadmap generation, chat, and motivational content. This document outlines the LLM implementation details.

## LLM Architecture

### Component Structure
1. **ModelConfigContext** - Manages LLM configuration settings
2. **GeminiService** - Handles API communication with Gemini
3. **RoadmapGenerator** - Specialized service for roadmap creation
4. **llm.ts** - Main interface for components to interact with LLM services

### Implementation Features

#### 1. Gemini API Integration
- Direct API calls to Gemini Pro 2.5
- Structured prompt engineering for Indonesian context
- Error handling with graceful fallbacks
- Mock responses for development and offline support

#### 2. Roadmap Generation
- Contextual prompts based on user goals and background
- JSON structure validation to ensure compatible format
- Caching mechanism to reduce API calls
- Indonesian educational context awareness

#### 3. Chat & Motivation
- Stateful chat with message history
- Roadmap-aware conversations
- Dynamic motivational messages based on progress
- Playfulness adjustment based on user interaction

## Prompt Engineering

### Roadmap Generation Prompt
The roadmap generation uses structured prompts that:
- Provide educational context (SMA vs. university)
- Adjust focus (education vs. experience)
- Set tone (professional vs. playful)
- Request specific JSON format
- Enforce Indonesian educational and career context

### Chat Prompts
Chat prompts include:
- Contextual information about the user's roadmap
- Previous message history
- Guidance for response format and style

## Offline Support & Error Handling
- Client-side caching of roadmaps and responses
- Mock implementations for development and fallbacks
- Graceful error handling with user-friendly messages
- Network status detection and appropriate fallbacks

## Considerations for Future Development
- Adding more Indonesian-specific resources and pathways
- Implementing feedback mechanisms to improve prompt quality
- Expanding language support (current focus is Bahasa Indonesia)
- Optimizing token usage and API costs
