
import { GoogleGenAI, Type } from "@google/genai";
import universityData from '../universities.ts';
import { NewsItem } from "../types";

/**
 * CampusAI Core AI Bridge
 * Automatically uses the pre-configured environment API key.
 */

const validateApiKey = () => {
  const key = process.env.API_KEY;
  if (!key || key === 'undefined' || key === '') {
    console.error("CRITICAL: Gemini API Key is missing. Please set your API_KEY environment variable.");
    return false;
  }
  return true;
};

export const analyzeMultimodalMessage = async (
  message: string, 
  imageData?: { data: string, mimeType: string },
  history: { role: 'user' | 'model', text: string }[] = []
) => {
  if (!validateApiKey()) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const parts: any[] = [{ text: message }];
  if (imageData) {
    parts.push({
      inlineData: {
        data: imageData.data,
        mimeType: imageData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...formattedHistory, { role: 'user', parts }],
      config: {
        systemInstruction: `You are CampusAI Pro, a friendly academic assistant for Nigerian students. 
        You analyze documents like JAMB slips and admission letters. 
        Summarize key info and advise on next steps based on Nigerian standards.`,
      },
    });

    return {
      text: response.text || "I've analyzed the content but couldn't generate a text response.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error("Vision API Error Details:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model', text: string }[] = []) => {
  if (!validateApiKey()) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `You are CampusAI, a friendly AI assistant for Nigerian Higher Education. 
        Expertise: JAMB, Post-UTME, and university cut-offs. Use Google Search for current 2026/2027 dates.`,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "I'm processing that information right now.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error("Chat API Error Details:", error);
    throw error;
  }
};

export const getUniversityDetailedInfo = async (name: string) => {
  if (!validateApiKey()) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide info for ${name} in Nigeria.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING },
            founded: { type: Type.STRING },
            motto: { type: Type.STRING },
            bestKnownFor: { type: Type.STRING },
            campusVibe: { type: Type.STRING }
          },
          required: ["bio", "founded", "motto", "bestKnownFor", "campusVibe"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { 
    return null; 
  }
};

export const getUniversityCourses = async (university: string) => {
  if (!validateApiKey()) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List courses at ${university} in Nigeria.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]") as string[];
  } catch (e) { 
    return []; 
  }
};

export const getCourseCutoffInfo = async (university: string, course: string) => {
  if (!validateApiKey()) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the merit cut-off and JAMB subject combination for ${course} at ${university} for the 2026 session.`,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cutoff: { type: Type.STRING },
            subjectCombination: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            reliability: { type: Type.STRING }
          },
          required: ["cutoff", "subjectCombination", "recommendation", "reliability"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { 
    return null; 
  }
};

export const fetchLiveNews = async (): Promise<NewsItem[]> => {
  if (!validateApiKey()) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Search for 6 recent JAMB and Nigerian University news updates for January 2026.",
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              date: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              sourceUrl: { type: Type.STRING }
            },
            required: ["id", "title", "category", "date", "excerpt", "sourceUrl"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]") as NewsItem[];
  } catch (e) { 
    return []; 
  }
};
