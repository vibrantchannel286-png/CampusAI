import { formatUpdate } from './gemini';
import universitiesData from './universities.json';
import jambData from './jamb.json';

export interface University {
  name: string;
  slug: string;
  category: string;
  url: string;
}

export interface Update {
  id: string;
  title: string;
  date: string;
  summary: string;
  fullText: string;
  category?: string;
  sourceUrl: string;
  deadline?: string | null;
  universitySlug?: string;
  universityName?: string;
  keyPoints?: string[];
}

// Simulated function to fetch updates from universities
// In production, this would scrape or fetch from APIs
export async function fetchUniversityUpdates(slug?: string): Promise<Update[]> {
  // For demo purposes, generate some sample updates
  // In production, this would fetch from actual university websites
  
  const updates: Update[] = [];
  
  if (slug) {
    const university = universitiesData.find((u: University) => u.slug === slug);
    if (university) {
      // Generate sample updates for a specific university
      const sampleTitles = [
        `${university.name} Resumption Date Announced`,
        `Admission List Released at ${university.name}`,
        `${university.name} Post-UTME Registration Opens`,
        `Examination Schedule Released`,
        `Convocation Ceremony Dates Announced`,
      ];
      
      for (let i = 0; i < 5; i++) {
        const fullText = `This is a sample update from ${university.name}. The university has announced important information regarding ${sampleTitles[i]}. Students are advised to check the official website for more details.`;
        
        // Use formatUpdate to get professional formatting with title, summary, and key points
        const formatted = await formatUpdate(fullText).catch(() => ({
          title: sampleTitles[i],
          summary: fullText.substring(0, 150) + '...',
          keyPoints: []
        }));
        
        updates.push({
          id: `${slug}-${i + 1}`,
          title: formatted.title,
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          summary: formatted.summary,
          fullText,
          sourceUrl: university.url,
          universitySlug: slug,
          universityName: university.name,
          keyPoints: formatted.keyPoints,
        });
      }
    }
  } else {
    // Generate updates for all universities (limited sample)
    const sampleUniversities = universitiesData.slice(0, 10);
    
    for (let index = 0; index < sampleUniversities.length; index++) {
      const university = sampleUniversities[index];
      const fullText = `Latest update from ${university.name}. Important announcements and news for students.`;
      
      // Use formatUpdate to get professional formatting with title, summary, and key points
      const formatted = await formatUpdate(fullText).catch(() => ({
        title: `Latest Updates from ${university.name}`,
        summary: fullText.substring(0, 150) + '...',
        keyPoints: []
      }));
      
      updates.push({
        id: `${university.slug}-${Date.now()}-${index}`,
        title: formatted.title,
        date: new Date().toISOString().split('T')[0],
        summary: formatted.summary,
        fullText,
        sourceUrl: university.url,
        universitySlug: university.slug,
        universityName: university.name,
        keyPoints: formatted.keyPoints,
      });
    }
  }
  
  return updates;
}

export function fetchJAMBUpdates(): Update[] {
  return jambData.map((item: any) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    summary: item.summary,
    fullText: item.fullText,
    category: item.category,
    sourceUrl: item.sourceUrl,
    deadline: item.deadline || null,
  }));
}

export function getAllUniversities(): University[] {
  return universitiesData as University[];
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universitiesData.find((u: University) => u.slug === slug);
}

