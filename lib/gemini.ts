import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (server-side only - more secure)
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work properly.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

export async function summarizeText(text: string): Promise<string> {
  // If no API key or model, return truncated text immediately
  if (!model || !apiKey) {
    return text.substring(0, 150) + '...';
  }

  try {
    const prompt = `Summarize the following text in 2-3 sentences. Focus on the key information: ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Silently fall back to truncated text - don't log errors during build
    // Only log in development or if it's not a 404 (which we've already fixed)
    if (process.env.NODE_ENV === 'development' && error.status !== 404) {
      console.error('Error summarizing text:', error.message || error);
    }
    // Return truncated text as fallback
    return text.substring(0, 150) + '...';
  }
}

export async function chatWithGemini(userMessage: string, context?: string): Promise<string> {
  // If no API key or model, return helpful error message
  if (!model || !apiKey) {
    return "I'm sorry, the AI service is currently unavailable. Please check the API configuration. For now, you can visit our homepage to see the latest updates from Nigerian universities and JAMB.";
  }

  try {
    const systemPrompt = `You are CampusAI, a helpful assistant for Nigerian university students and JAMB candidates. 
    Provide accurate, helpful information about Nigerian universities and JAMB updates.
    ${context ? `Context: ${context}` : ''}
    Answer the user's question concisely and helpfully.`;
    
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nCampusAI:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Log error details for debugging
    console.error('Error in chat:', {
      status: error.status,
      message: error.message,
      statusText: error.statusText
    });
    
    // Provide more specific error messages
    if (error.status === 403 || error.message?.includes('API Key') || error.message?.includes('Forbidden')) {
      return "I'm sorry, there's an issue with the AI service configuration. Please contact the administrator.";
    }
    
    if (error.status === 404 || error.message?.includes('404') || error.message?.includes('Not Found')) {
      return "I'm sorry, there's an issue with the AI model configuration. Please ensure you're using a valid Gemini API key and the latest model names.";
    }
    
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or check your internet connection.";
  }
}
