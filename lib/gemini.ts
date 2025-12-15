import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function summarizeText(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following text in 2-3 sentences. Focus on the key information: ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing text:', error);
    return text.substring(0, 150) + '...'; // Fallback to truncation
  }
}

export async function chatWithGemini(userMessage: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const systemPrompt = `You are CampusAI, a helpful assistant for Nigerian university students and JAMB candidates. 
    Provide accurate, helpful information about Nigerian universities and JAMB updates.
    ${context ? `Context: ${context}` : ''}
    Answer the user's question concisely and helpfully.`;
    
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nCampusAI:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or check your internet connection.";
  }
}
