import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NewsCard from '@/components/NewsCard';
import { fetchUniversityUpdates, getUniversityBySlug, getAllUniversities } from '@/lib/fetchUpdates';
import { Update, University } from '@/lib/fetchUpdates';
import { collection, addDoc } from 'firebase/firestore';
import { FaArrowLeft, FaBell } from 'react-icons/fa';

interface SchoolPageProps {
  university: University;
  updates: Update[];
}

export default function SchoolPage({ university, updates }: SchoolPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribed) return;

    // Dynamically import Firebase to ensure it's only used on client side
    const { db } = await import('@/lib/firebase');
    if (!db) {
      alert('Firebase is not initialized. Please check your configuration.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim(),
        universitySlug: university.slug,
        universityName: university.name,
        subscribedAt: new Date().toISOString(),
      });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{university.name} - CampusAI.ng</title>
        <meta name="description" content={`Latest updates from ${university.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#008751] text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 hover:text-[#FFD700] transition-colors"
            >
              <FaArrowLeft /> Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1 bg-[#FFD700] text-gray-900 rounded-full font-semibold text-sm">
                    {university.category}
                  </span>
                  <Link
                    href="/"
                    className="text-green-100 hover:text-white transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Subscribe Section */}
          <div className="card mb-8 bg-gradient-to-r from-[#008751] to-[#006b42] text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaBell className="text-2xl" />
                <div>
                  <h3 className="text-xl font-bold">Stay Updated!</h3>
                  <p className="text-green-100">Get notified when {university.name} posts new updates</p>
                </div>
              </div>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 md:w-64 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              ) : (
                <div className="px-6 py-3 bg-[#FFD700] text-gray-900 rounded-lg font-semibold">
                  ✓ Subscribed Successfully!
                </div>
              )}
            </div>
          </div>

          {/* Updates Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>

            {updates.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg">
                  No updates available at the moment. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <NewsCard key={update.id} update={update} showUniversity={false} />
                ))}
              </div>
            )}
          </div>

          {/* Official Website Link */}
          <div className="card bg-[#FFD700] text-gray-900">
            <h3 className="text-xl font-bold mb-2">Official Website</h3>
            <p className="mb-4">Visit the official {university.name} website for more information.</p>
            <a
              href={university.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Visit Official Site →
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#008751] text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg font-semibold mb-2">© 2026 CampusAI.ng</p>
            <p className="text-green-100">Your Campus, Smarter.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const universities = getAllUniversities();
  const paths = universities.map((university) => ({
    params: { slug: university.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const university = getUniversityBySlug(slug);

  if (!university) {
    return {
      notFound: true,
    };
  }

  try {
    const updates = await fetchUniversityUpdates(slug);
    return {
      props: {
        university,
        updates,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching updates:', error);
    return {
      props: {
        university,
        updates: [],
      },
      revalidate: 60,
    };
  }
};

