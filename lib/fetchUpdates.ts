import { formatUpdate } from './gemini';
import universitiesData from './universities.json';
import jambData from './jamb.json';
import axios from 'axios';
import cheerio from 'cheerio';

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

// --- Scraper for University of Lagos (UNILAG) ---
async function scrapeUnilagUpdates(): Promise<Update[]> {
  try {
    const { data } = await axios.get('https://unilag.edu.ng/news/');
    const $ = cheerio.load(data);
    const updates: Update[] = [];
    const articles = $('article.news-block-item').get();

    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const element = articles[i];
      const titleElement = $(element).find('h3 a');
      const rawTitle = titleElement.text().trim();
      const url = titleElement.attr('href') || '';

      if (rawTitle && url) {
        try {
          const { data: articleData } = await axios.get(url);
          const $$ = cheerio.load(articleData);
          const fullText = $$('.entry-content').text().trim();

          if (fullText) {
            const formatted = await formatUpdate(fullText);
            updates.push({
              id: `unilag-${i}`,
              title: formatted.title,
              date: new Date().toISOString().split('T')[0],
              summary: formatted.summary,
              fullText,
              sourceUrl: url,
              universitySlug: 'unilag',
              universityName: 'University of Lagos',
              keyPoints: formatted.keyPoints,
            });
          }
        } catch (articleError) {
          console.error(`Error scraping article at ${url}:`, articleError);
        }
      }
    }
    return updates;
  } catch (error) {
    console.error('Error scraping UNILAG updates:', error);
    return [];
  }
}

// --- Scraper for University of Ibadan (UI) ---
async function scrapeUiUpdates(): Promise<Update[]> {
  try {
    const { data } = await axios.get('https://www.ui.edu.ng/news');
    const $ = cheerio.load(data);
    const updates: Update[] = [];
    const articles = $('div.news-item').get();

    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const element = articles[i];
      const titleElement = $(element).find('h2.news-title a');
      const rawTitle = titleElement.text().trim();
      const url = titleElement.attr('href') || '';

      if (rawTitle && url) {
        try {
          const { data: articleData } = await axios.get(url);
          const $$ = cheerio.load(articleData);
          const fullText = $$('.article-body').text().trim();

          if (fullText) {
            const formatted = await formatUpdate(fullText);
            updates.push({
              id: `ui-${i}`,
              title: formatted.title,
              date: new Date().toISOString().split('T')[0],
              summary: formatted.summary,
              fullText,
              sourceUrl: url,
              universitySlug: 'ui',
              universityName: 'University of Ibadan',
              keyPoints: formatted.keyPoints,
            });
          }
        } catch (articleError) {
          console.error(`Error scraping UI article at ${url}:`, articleError);
        }
      }
    }
    return updates;
  } catch (error) {
    console.error('Error scraping UI updates:', error);
    return [];
  }
}

// --- Scraper for Federal University of Technology Akure (FUTA) ---
async function scrapeFutaUpdates(): Promise<Update[]> {
  try {
    const { data } = await axios.get('https://futa.edu.ng/news-events/');
    const $ = cheerio.load(data);
    const updates: Update[] = [];
    const articles = $('div.news-post-item').get();

    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const element = articles[i];
      const titleElement = $(element).find('h3.news-title a');
      const rawTitle = titleElement.text().trim();
      const url = titleElement.attr('href') || '';

      if (rawTitle && url) {
        try {
          const { data: articleData } = await axios.get(url);
          const $$ = cheerio.load(articleData);
          const fullText = $$('.entry-content').text().trim();

          if (fullText) {
            const formatted = await formatUpdate(fullText);
            updates.push({
              id: `futa-${i}`,
              title: formatted.title,
              date: new Date().toISOString().split('T')[0],
              summary: formatted.summary,
              fullText,
              sourceUrl: url,
              universitySlug: 'futa',
              universityName: 'Federal University of Technology Akure',
              keyPoints: formatted.keyPoints,
            });
          }
        } catch (articleError) {
          console.error(`Error scraping FUTA article at ${url}:`, articleError);
        }
      }
    }
    return updates;
  } catch (error) {
    console.error('Error scraping FUTA updates:', error);
    return [];
  }
}

// --- Scraper for Ahmadu Bello University (ABU) ---
async function scrapeAbuUpdates(): Promise<Update[]> {
  try {
    // Note: The URL and selectors are guesses and will likely need adjustment.
    const { data } = await axios.get('https://www.abu.edu.ng/news-and-events/');
    const $ = cheerio.load(data);
    const updates: Update[] = [];
    // Common selectors for news items - this is a guess
    const articles = $('article.post-item').get();

    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const element = articles[i];
      const titleElement = $(element).find('h2.entry-title a'); // Assumed selector
      const rawTitle = titleElement.text().trim();
      const url = titleElement.attr('href') || '';

      if (rawTitle && url) {
        try {
          const { data: articleData } = await axios.get(url);
          const $$ = cheerio.load(articleData);
          const fullText = $$('.entry-content').text().trim(); // Assumed selector

          if (fullText) {
            const formatted = await formatUpdate(fullText);
            updates.push({
              id: `abu-${i}`,
              title: formatted.title,
              date: new Date().toISOString().split('T')[0],
              summary: formatted.summary,
              fullText,
              sourceUrl: url,
              universitySlug: 'abu',
              universityName: 'Ahmadu Bello University',
              keyPoints: formatted.keyPoints,
            });
          }
        } catch (articleError) {
          console.error(`Error scraping ABU article at ${url}:`, articleError);
        }
      }
    }
    return updates;
  } catch (error) {
    console.error('Error scraping ABU updates:', error);
    return [];
  }
}


// --- Scraper Registry ---
const scraperRegistry: { [slug: string]: () => Promise<Update[]> } = {
  'unilag': scrapeUnilagUpdates,
  'ui': scrapeUiUpdates,
  'futa': scrapeFutaUpdates,
  'abu': scrapeAbuUpdates,
};

// --- Main Function to Fetch University Updates ---
export async function fetchUniversityUpdates(slug?: string): Promise<Update[]> {
  if (slug) {
    const scraper = scraperRegistry[slug];
    if (scraper) {
      return await scraper();
    }
    
    const university = universitiesData.find((u) => u.slug === slug);
    if (university) {
      return generateSampleUpdates(university);
    }
    return [];

  } else {
    let allUpdates: Update[] = [];
    const universitiesWithScrapers = Object.keys(scraperRegistry);
    
    for (const uniSlug of universitiesWithScrapers) {
        try {
            const scraper = scraperRegistry[uniSlug];
            const updates = await scraper();
            allUpdates.push(...updates);
        } catch (error) {
            console.error(`Failed to scrape ${uniSlug}:`, error);
        }
    }

    const otherUniversities = universitiesData
        .filter(u => !universitiesWithScrapers.includes(u.slug))
        .slice(0, 3);

    for (const university of otherUniversities) {
        allUpdates.push(...generateSampleUpdates(university));
    }
    
    return allUpdates;
  }
}

// --- Fallback Function for Sample Data ---
function generateSampleUpdates(university: University): Update[] {
  const sampleTitles = [
    `Resumption Date for New Session`,
    `Release of 2024/2025 Admission List`,
    `Post-UTME Screening Registration`,
  ];
  return sampleTitles.map((title, i) => ({
    id: `${university.slug}-sample-${i}`,
    title: `${title} at ${university.name}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    summary: `This is a sample update summary for ${title}. Visit the official school website for more details.`,
    fullText: `The management of ${university.name} has announced important updates regarding the ${title}. Please check the university portal.`,
    sourceUrl: university.url,
    universitySlug: university.slug,
    universityName: university.name,
    keyPoints: ['This is a sample update.', 'Check the official website for details.'],
  }));
}

// --- Existing JAMB and Utility Functions ---
export function fetchJAMBUpdates(): Update[] {
  return jambData.map((item: any) => ({ ...item }));
}

export function getAllUniversities(): University[] {
  return universitiesData as University[];
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universitiesData.find((u: University) => u.slug === slug);
}
