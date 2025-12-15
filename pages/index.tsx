import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import CategoryTabs from '@/components/CategoryTabs';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import { fetchUniversityUpdates, fetchJAMBUpdates, getAllUniversities, Update } from '@/lib/fetchUpdates';

interface HomeProps {
  initialUpdates: Update[];
  universities: { name: string; slug: string; category: string }[];
}

export default function Home({ initialUpdates, universities }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterUpdates = () => {
      let filtered = [...initialUpdates];

      // Filter by category
      if (activeCategory !== 'All') {
        if (activeCategory === 'JAMB Updates') {
          filtered = filtered.filter((u) => !u.universitySlug);
        } else {
          filtered = filtered.filter((u) => {
            const university = universities.find((uni) => uni.slug === u.universitySlug);
            return university?.category === activeCategory;
          });
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.title.toLowerCase().includes(query) ||
            u.summary.toLowerCase().includes(query) ||
            u.universityName?.toLowerCase().includes(query)
        );
      }

      setUpdates(filtered);
    };

    filterUpdates();
  }, [activeCategory, searchQuery, initialUpdates, universities]);

  return (
    <>
      <Head>
        <title>CampusAI.ng - Your Campus, Smarter</title>
        <meta name="description" content="Latest updates from all Nigerian universities and JAMB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#008751] text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">CampusAI.ng</h1>
                <p className="text-green-100">Your Campus, Smarter</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/jamb" className="hover:text-[#FFD700] transition-colors">
                  JAMB Updates
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Category Tabs */}
          <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* Ad Placeholder */}
          <div className="mb-6 bg-gray-200 rounded-lg p-8 text-center text-gray-500">
            <p className="text-sm">Advertisement Space</p>
          </div>

          {/* Updates Feed */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeCategory === 'All' ? 'Latest Updates' : `${activeCategory} Updates`}
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008751]"></div>
                <p className="mt-4 text-gray-600">Loading updates...</p>
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600 text-lg">
                  No updates found. Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <NewsCard key={update.id} update={update} showUniversity={true} />
                ))}
              </div>
            )}
          </div>

          {/* Featured Schools Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Schools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {universities.slice(0, 6).map((university) => (
                <Link
                  key={university.slug}
                  href={`/school/${university.slug}`}
                  className="card hover:scale-105 transition-transform duration-200"
                >
                  <h3 className="font-bold text-lg text-[#008751] mb-2">{university.name}</h3>
                  <p className="text-sm text-gray-600">{university.category}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Ad Placeholder */}
          <div className="mb-6 bg-gray-200 rounded-lg p-8 text-center text-gray-500">
            <p className="text-sm">Advertisement Space</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#008751] text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg font-semibold mb-2">© 2026 CampusAI.ng</p>
            <p className="text-green-100">Your Campus, Smarter.</p>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <Link href="/" className="hover:text-[#FFD700] transition-colors">
                Home
              </Link>
              <Link href="/jamb" className="hover:text-[#FFD700] transition-colors">
                JAMB Updates
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const universities = getAllUniversities();
    const universityUpdates = await fetchUniversityUpdates();
    const jambUpdates = fetchJAMBUpdates();
    
    // Combine and sort by date
    const allUpdates = [...universityUpdates, ...jambUpdates].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      props: {
        initialUpdates: allUpdates.slice(0, 50), // Limit initial updates
        universities: universities.map((u) => ({
          name: u.name,
          slug: u.slug,
          category: u.category,
        })),
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching updates:', error);
    return {
      props: {
        initialUpdates: [],
        universities: [],
      },
      revalidate: 60,
    };
  }
};

