
import { NewsItem } from './types';

export const ADMISSION_DATES = {
  // Synchronized with the official announcement in the news grid
  JAMB_REG_START: '2026-01-31T08:00:00',
  UNILAG_POST_UTME: '2026-02-15T00:00:00',
  UI_POST_UTME: '2026-03-01T00:00:00'
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '3',
    title: 'JAMB Announces Official Registration Dates for 2026 UTME/DE',
    category: 'JAMB',
    date: 'Jan 25, 2026',
    image: '',
    excerpt: 'The Joint Admissions and Matriculation Board (JAMB) has scheduled the 2026 Unified Tertiary Matriculation Examination (UTME) registration to commence on January 31, 2026, and conclude on March 8, 2026. Candidates are required to generate their profile codes using their NIN before visiting accredited CBT centres.',
    sourceUrl: 'https://www.jamb.gov.ng'
  },
  {
    id: '1',
    title: 'UNILAG Announces 2026/2027 Post-UTME Registration Schedule',
    category: 'Federal',
    date: 'Jan 02, 2026',
    image: '',
    excerpt: 'The University of Lagos (UNILAG) has released the early schedule for the 2026 screening exercise. Candidates are advised to prepare their O-Level results.',
    sourceUrl: 'https://unilag.edu.ng/?cat=4'
  },
  {
    id: '2',
    title: 'LASU Tops State University Rankings for 2026 Academic Session',
    category: 'State',
    date: 'Jan 01, 2026',
    image: '',
    excerpt: 'Lagos State University (LASU) continues its dominance in research and student welfare, securing the #1 spot in the latest January rankings.',
    sourceUrl: 'https://lasu.edu.ng/home/news/'
  },
  {
    id: '4',
    title: 'Covenant University Commissions Multi-Million Naira AI Hub',
    category: 'Private',
    date: 'Dec 28, 2025',
    image: '',
    excerpt: 'Leading the tech revolution, Covenant University has opened a state-of-the-art AI laboratory to foster innovation in the 2026 session.',
    sourceUrl: 'https://covenantuniversity.edu.ng/News'
  }
];

export const TICKER_HEADLINES = [
  "JAMB 2026 registration officially begins January 31st - NIN is mandatory...",
  "UNILAG 2026/2027 admission portal now active for updates...",
  "Federal Government increases education budget for the 2026 cycle...",
  "Post-UTME cut-off marks for top schools released - Check CampusAI...",
  "Welcome to the 2026 Academic Year! Stay ahead with CampusAI.ng"
];
