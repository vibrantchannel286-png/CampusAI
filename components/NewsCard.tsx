import React from 'react';
import { Update } from '@/lib/fetchUpdates';
import { formatDistanceToNow } from 'date-fns';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface NewsCardProps {
  update: Update;
  showUniversity?: boolean;
}

export default function NewsCard({ update, showUniversity = false }: NewsCardProps) {
  const formattedDate = formatDistanceToNow(new Date(update.date), { addSuffix: true });
  
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{update.title}</h3>
          {showUniversity && update.universityName && (
            <p className="text-sm text-[#008751] font-semibold mb-2">
              {update.universityName}
            </p>
          )}
          {update.category && (
            <span className="inline-block px-3 py-1 bg-[#FFD700] text-gray-900 text-xs font-semibold rounded-full mb-2">
              {update.category}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 ml-4">{formattedDate}</span>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">{update.summary}</p>
      
      {/* Key Points */}
      {update.keyPoints && update.keyPoints.length > 0 && (
        <div className="mb-4 bg-gray-50 rounded-lg p-4 border-l-4 border-[#008751]">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Points:</h4>
          <ul className="space-y-1">
            {update.keyPoints.map((point, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-[#008751] mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 items-center">
        <a
          href={update.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          View Source <FaExternalLinkAlt className="text-xs" />
        </a>
        
        {update.deadline && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 font-semibold">
              Deadline: {new Date(update.deadline).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

