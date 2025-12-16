import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const publicGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  return res.status(200).json({
    hasGeminiKey: !!geminiKey,
    hasPublicGeminiKey: !!publicGeminiKey,
    geminiKeyLength: geminiKey?.length || 0,
    publicGeminiKeyLength: publicGeminiKey?.length || 0,
    geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 10) + '...' : 'NOT SET',
    publicGeminiKeyPrefix: publicGeminiKey ? publicGeminiKey.substring(0, 10) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    message: publicGeminiKey 
      ? 'API key is loaded correctly!' 
      : 'API key is NOT loaded. Restart your dev server after updating .env.local'
  });
}
