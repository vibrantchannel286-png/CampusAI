import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work properly.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function summarizeText(text: string): Promise<string> {
  // If no API key, return truncated text
  if (!genAI || !apiKey) {
    console.warn('Gemini API key not configured. Using fallback text truncation.');
    return text.substring(0, 150) + '...';
  }

  try {
    // Use the current Gemini model (gemini-1.5-flash is faster and free, gemini-1.5-pro is more capable)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize the following text in 2-3 sentences. Focus on the key information: ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error summarizing text:', error);
    // Return truncated text as fallback
    return text.substring(0, 150) + '...';
  }
}

export async function chatWithGemini(userMessage: string, context?: string): Promise<string> {
  // If no API key, return helpful error message
  if (!genAI || !apiKey) {
    console.error('Gemini API key not configured. Chat functionality unavailable.');
    return "I'm sorry, the AI service is currently unavailable. Please check the API configuration. For now, you can visit our homepage to see the latest updates from Nigerian universities and JAMB.";
  }

  try {
    // Use the current Gemini model (gemini-1.5-flash is faster and free, gemini-1.5-pro is more capable)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `You are CampusAI, a helpful assistant for Nigerian university students and JAMB candidates. 
    Provide accurate, helpful information about Nigerian universities and JAMB updates.
    ${context ? `Context: ${context}` : ''}
    Answer the user's question concisely and helpfully.`;
    
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nCampusAI:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error in chat:', error);
    
    // Provide more specific error messages
    if (error.status === 403 || error.message?.includes('API Key')) {
      return "I'm sorry, there's an issue with the AI service configuration. Please contact the administrator.";
    }
    
    if (error.status === 404 || error.message?.includes('404')) {
      return "I'm sorry, there's an issue with the AI model configuration. The service is being updated. Please try again later.";
    }
    
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or check your internet connection.";
  }
}
