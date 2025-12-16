import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Lazy initialization with error handling
// This prevents module load-time crashes if initialization fails
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let initializationAttempted = false;

function getApiKey(): string {
  // Check both server-side and client-side environment variables
  const serverKey = process.env.GEMINI_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  // Log in development to help debug
  if (process.env.NODE_ENV === 'development' && !serverKey && !publicKey) {
    console.warn('[Gemini] No API key found in environment variables');
    console.warn('[Gemini] Checked GEMINI_API_KEY:', serverKey ? 'SET' : 'NOT SET');
    console.warn('[Gemini] Checked NEXT_PUBLIC_GEMINI_API_KEY:', publicKey ? 'SET' : 'NOT SET');
  }
  
  return serverKey || publicKey || '';
}

function getModel(): GenerativeModel | null {
  // Only attempt initialization once
  if (initializationAttempted) {
    return model;
  }
  
  initializationAttempted = true;
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work properly.');
    console.warn('Checked: GEMINI_API_KEY =', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
    console.warn('Checked: NEXT_PUBLIC_GEMINI_API_KEY =', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'SET' : 'NOT SET');
    return null;
  }
  
  // Log that API key was found (but don't log the actual key)
  if (process.env.NODE_ENV === 'development') {
    console.log('Gemini API key found, initializing model...');
  }
  
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    
    // Use available models from the API - updated to use models that actually exist
    // Based on available models: gemini-2.5-flash, gemini-flash-latest, gemini-pro-latest
    // Try in order of preference: latest stable flash, then latest pro, then stable versions
    const modelNamesToTry = [
      'gemini-2.5-flash',        // Stable, fast, recommended
      'gemini-flash-latest',     // Always latest flash version
      'gemini-2.0-flash',       // Stable 2.0 version
      'gemini-pro-latest',       // Latest pro version
      'gemini-2.5-pro',          // Stable pro version
    ];
    
    let lastError: any = null;
    
    for (const modelName of modelNamesToTry) {
      try {
        const testModel = genAI.getGenerativeModel({ model: modelName });
        // Just create the model object - actual API call will happen when used
        model = testModel;
        if (process.env.NODE_ENV === 'development') {
          console.log(`Gemini AI model initialized successfully: ${modelName}`);
        }
        return model;
      } catch (error: any) {
        lastError = error;
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to initialize ${modelName}:`, error.message?.substring(0, 100));
        }
        // Continue to next model
        continue;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('No available models found');
  } catch (error: any) {
    // Gracefully handle initialization errors
    console.error('Error initializing Gemini AI:', error.message || error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    genAI = null;
    model = null;
    return null;
  }
}

export async function summarizeText(text: string): Promise<string> {
  // Lazy initialization with error handling
  const currentModel = getModel();
  const apiKey = getApiKey();
  
  // If no API key or model, return truncated text immediately
  if (!currentModel || !apiKey) {
    return text.substring(0, 150) + '...';
  }

  try {
    const prompt = `Summarize the following text in 2-3 sentences. Focus on the key information: ${text}`;
    
    const result = await currentModel.generateContent(prompt);
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

export interface FormattedUpdate {
  title: string;
  summary: string;
  keyPoints: string[];
}

export async function formatUpdate(updateText: string): Promise<FormattedUpdate> {
  // Lazy initialization with error handling
  const currentModel = getModel();
  const apiKey = getApiKey();
  
  // If no API key or model, return basic formatted version
  if (!currentModel || !apiKey) {
    const lines = updateText.split('\n').filter(line => line.trim());
    return {
      title: lines[0]?.substring(0, 100) || 'Update',
      summary: updateText.substring(0, 200) + '...',
      keyPoints: lines.slice(1, 4).map(line => line.trim()).filter(Boolean)
    };
  }

  try {
    const prompt = `You are an AI that turns university or JAMB updates into professional, website-ready news posts.

Update text:

"${updateText}"

Instructions:
1. Create a clear, catchy title.
2. Write a 2–3 sentence summary as a news-style update.
3. List key points, like deadlines, dates, or required actions, in bullet form.
4. Keep it factual and only use information in the update.
5. Output in plain text like this:

Title: [Your title here]

Summary: [2–3 sentence summary]

Key Points:
- [Fact 1]
- [Fact 2]
- [Fact 3]`;

    const result = await currentModel.generateContent(prompt);
    const response = await result.response;
    const formattedText = response.text();
    
    // Parse the formatted response
    const lines = formattedText.split('\n').map(line => line.trim()).filter(Boolean);
    let title = '';
    let summary = '';
    const keyPoints: string[] = [];
    let currentSection = '';
    
    for (const line of lines) {
      if (line.startsWith('Title:')) {
        title = line.replace(/^Title:\s*/i, '').trim();
        currentSection = 'title';
      } else if (line.startsWith('Summary:')) {
        // Extract content after "Summary:" if present, otherwise start empty
        const summaryContent = line.replace(/^Summary:\s*/i, '').trim();
        summary = summaryContent;
        currentSection = 'summary';
      } else if (line.match(/^Key Points:?\s*$/i)) {
        // Only match section headers, not text containing "key points"
        currentSection = 'keyPoints';
      } else if (line.startsWith('-')) {
        // Detect bullet points even if "Key Points:" header is missing
        // If we're in summary section, switch to keyPoints (header was omitted)
        if (currentSection === 'summary') {
          currentSection = 'keyPoints';
        }
        // Capture the bullet point as a key point
        keyPoints.push(line.replace(/^-\s*/, '').trim());
      } else if (currentSection === 'summary') {
        // Append continuation lines to summary (even if summary is initially empty)
        if (summary) {
          summary += ' ' + line;
        } else {
          summary = line;
        }
      } else if (currentSection === 'keyPoints') {
        // In keyPoints section, only capture bullet points
        // Non-bullet lines are ignored (could be empty lines or formatting)
      } else if (currentSection === 'title' && !title) {
        title = line;
      }
    }
    
    // Fallback if parsing failed
    if (!title) {
      title = updateText.split('\n')[0]?.substring(0, 100) || 'Update';
    }
    if (!summary) {
      summary = updateText.substring(0, 200) + '...';
    }
    if (keyPoints.length === 0) {
      // Extract potential key points from the text
      const sentences = updateText.split(/[.!?]/).filter(s => s.trim().length > 20);
      keyPoints.push(...sentences.slice(0, 3).map(s => s.trim()));
    }
    
    return { title, summary, keyPoints };
  } catch (error: any) {
    // Fallback to basic formatting on error
    if (process.env.NODE_ENV === 'development' && error.status !== 404) {
      console.error('Error formatting update:', error.message || error);
    }
    
    const lines = updateText.split('\n').filter(line => line.trim());
    return {
      title: lines[0]?.substring(0, 100) || 'Update',
      summary: updateText.substring(0, 200) + '...',
      keyPoints: lines.slice(1, 4).map(line => line.trim()).filter(Boolean)
    };
  }
}

export async function chatWithGemini(userMessage: string, context?: string): Promise<string> {
  // Lazy initialization with error handling
  const currentModel = getModel();
  const apiKey = getApiKey();
  
  // If no API key or model, return helpful error message
  if (!currentModel || !apiKey) {
    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Chatbot unavailable - Model:', currentModel ? 'OK' : 'NULL', 'API Key:', apiKey ? 'SET' : 'MISSING');
    }
    return "I'm sorry, the AI service is currently unavailable. Please check the API configuration. For now, you can visit our homepage to see the latest updates from Nigerian universities and JAMB.";
  }

  try {
    const systemPrompt = `You are CampusAI, a helpful assistant for Nigerian university students and JAMB candidates. 
    Provide accurate, helpful information about Nigerian universities and JAMB updates.
    ${context ? `Context: ${context}` : ''}
    Answer the user's question concisely and helpfully.`;
    
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nCampusAI:`;
    
    const result = await currentModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Handle rate limiting (429 errors)
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('Too Many Requests')) {
      const retryAfter = error.message?.match(/retry in (\d+)/)?.[1] || '60';
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
      }
      return `I'm sorry, I'm receiving too many requests right now. Please wait about ${retryAfter} seconds and try again. The free tier allows 5 requests per minute. You can visit our homepage to see the latest updates from Nigerian universities and JAMB while you wait.`;
    }
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
    
    // Rate limiting is already handled above, so this is for other errors
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or check your internet connection.";
  }
}
