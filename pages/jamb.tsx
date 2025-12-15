import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { fetchJAMBUpdates, Update } from '@/lib/fetchUpdates';
import { FaArrowLeft } from 'react-icons/fa';

interface JAMBPageProps {
  updates: Update[];
}

export default function JAMBPage({ updates }: JAMBPageProps) {
  const [nextDeadline, setNextDeadline] = useState<Update | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    // Find the next deadline
    const deadlines = updates
      .filter((u) => u.deadline)
      .sort((a, b) => {
        const dateA = new Date(a.deadline!).getTime();
        const dateB = new Date(b.deadline!).getTime();
        return dateA - dateB;
      });

    const upcoming = deadlines.find((u) => {
      const deadlineDate = new Date(u.deadline!).getTime();
      return deadlineDate > Date.now();
    });

    if (upcoming) {
      setNextDeadline(upcoming);
    }
  }, [updates]);

  useEffect(() => {
    if (!nextDeadline?.deadline) return;

    const updateCountdown = () => {
      const now = Date.now();
      const deadline = new Date(nextDeadline.deadline!).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setCountdown('Deadline Passed');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextDeadline]);

  return (
    <>
      <Head>
        <title>JAMB Updates - CampusAI.ng</title>
        <meta name="description" content="Latest JAMB updates, exam dates, registration info, and deadlines" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#008751] text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 hover:text-[#FFD700] transition-colors"
            >
              <FaArrowLeft /> Back to Home
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">JAMB Updates</h1>
              <p className="text-green-100">Official updates from the Joint Admissions and Matriculation Board</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Countdown Timer */}
          {nextDeadline && countdown && (
            <div className="card mb-8 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">⏰ Upcoming Deadline</h3>
                <p className="text-xl mb-4">{nextDeadline.title}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4">
                    <p className="text-sm mb-1">Time Remaining</p>
                    <p className="text-3xl font-bold">{countdown}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4">
                    <p className="text-sm mb-1">Deadline</p>
                    <p className="text-xl font-bold">
                      {new Date(nextDeadline.deadline!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <a
                  href={nextDeadline.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Details →
                </a>
              </div>
            </div>
          )}

          {/* JAMB Info Section */}
          <div className="card mb-8 bg-[#FFD700] text-gray-900">
            <h2 className="text-2xl font-bold mb-4">About JAMB</h2>
            <p className="text-lg mb-4">
              The Joint Admissions and Matriculation Board (JAMB) is responsible for conducting
              the Unified Tertiary Matriculation Examination (UTME) and coordinating admissions
              into Nigerian tertiary institutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/50 rounded-lg p-4">
                <h3 className="font-bold mb-2">Registration Fee</h3>
                <p className="text-2xl font-bold">₦3,500</p>
                <p className="text-sm">+ Service charges</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h3 className="font-bold mb-2">Official Website</h3>
                <a
                  href="https://www.jamb.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#008751] hover:underline font-semibold"
                >
                  www.jamb.gov.ng →
                </a>
              </div>
            </div>
          </div>

          {/* Updates Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest JAMB Updates</h2>

            {updates.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg">
                  No JAMB updates available at the moment. Check back soon!
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
    const updates = fetchJAMBUpdates();
    return {
      props: {
        updates: updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching JAMB updates:', error);
    return {
      props: {
        updates: [],
      },
      revalidate: 60,
    };
  }
};

