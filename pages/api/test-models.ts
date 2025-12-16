import type { NextApiRequest, NextApiResponse } from 'next';

// Only allow in development
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'API key not found' });
  }

  try {
    // Fetch list of available models from the API
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch models',
        message: data.error?.message || 'Unknown error',
        details: data
      });
    }

    // Filter and format available models
    const availableModels = (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedMethods: m.supportedGenerationMethods
      }));

    return res.status(200).json({
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      totalModels: data.models?.length || 0,
      availableModels,
      message: 'List of available models for your API key'
    });
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Failed to fetch models',
      message: error.message 
    });
  }
}
