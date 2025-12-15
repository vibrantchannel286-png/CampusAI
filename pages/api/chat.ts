import type { NextApiRequest, NextApiResponse } from 'next';
import { chatWithGemini } from '@/lib/gemini';
import { getAllUniversities, fetchJAMBUpdates, getUniversityBySlug } from '@/lib/fetchUpdates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context from available data
    const universities = getAllUniversities();
    const jambUpdates = fetchJAMBUpdates();
    
    // Check if user is asking about a specific university
    const universityNames = universities.map((u) => u.name.toLowerCase());
    const mentionedUniversity = universityNames.find((name) => 
      message.toLowerCase().includes(name.toLowerCase().split(' ')[0])
    );

    let context = `You are CampusAI, a helpful assistant for Nigerian university students and JAMB candidates.
    
Available information:
- We track updates from ${universities.length} Nigerian universities (Federal, State, and Private)
- We have ${jambUpdates.length} JAMB updates available
- You can help users find information about specific universities, JAMB registration, exam dates, and admission processes

If asked about a specific university, you can mention that users can visit /school/[university-slug] for detailed updates.
If asked about JAMB, direct them to /jamb for the latest information.`;

    if (mentionedUniversity) {
      const university = universities.find((u) => 
        u.name.toLowerCase().includes(mentionedUniversity)
      );
      if (university) {
        context += `\n\nThe user mentioned ${university.name}, which is a ${university.category} university.`;
      }
    }

    // Check for JAMB-related queries
    if (message.toLowerCase().includes('jamb') || 
        message.toLowerCase().includes('utme') ||
        message.toLowerCase().includes('registration') ||
        message.toLowerCase().includes('exam')) {
      const upcomingDeadline = jambUpdates
        .filter((u) => u.deadline)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
        .find((u) => new Date(u.deadline!).getTime() > Date.now());

      if (upcomingDeadline) {
        context += `\n\nUpcoming JAMB deadline: ${upcomingDeadline.title} - ${new Date(upcomingDeadline.deadline!).toLocaleDateString()}`;
      }
    }

    const response = await chatWithGemini(message, context);

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
    });
  }
}

