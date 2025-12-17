/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Check } from 'lucide-react';
import env from '@/lib/env';

// Types
interface Series {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: {
    url: string;
    alt: string;
  };
  isActive: boolean;
  blogCount: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Series[];
}

interface SeriesProps {
  id: string | null;
  setId: (id: string | null) => void;
}

export default function Series({ id, setId }: SeriesProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch series data
  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        env.BACKEND_URL + '/api/admin/blogs/series?isActive=true&limit=50'
      );
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setSeries(data.data);
      } else {
        console.error('Failed to fetch series:', data.message);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle series selection
  const handleSelect = (seriesId: string) => {
    if (id === seriesId) {
      // Deselect if already selected
      setId(null);
    } else {
      // Select new series
      setId(seriesId);
    }
  };

  // Load series on component mount
  useEffect(() => {
    fetchSeries();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-3">Select Series (Optional)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-300 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-3">Select Series</div>

      {/* Series Options */}
      {series.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm">No active series available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {series.map(seriesItem => (
            <div
              key={seriesItem._id}
              onClick={() => handleSelect(seriesItem._id)}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                id === seriesItem._id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Cover Image */}
                  {seriesItem.coverImage && (
                    <img
                      src={seriesItem.coverImage.url}
                      alt={seriesItem.coverImage.alt}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                  )}

                  {/* Series Info */}
                  <div className="font-medium text-gray-900 mb-1 truncate">{seriesItem.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {seriesItem.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {seriesItem.blogCount} blog
                    {seriesItem.blogCount !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Selection Indicator */}
                {id === seriesItem._id && (
                  <Check className="text-blue-600 ml-2 flex-shrink-0" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Series Info */}
      {id && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <span className="text-blue-800">
            Selected: {series.find(s => s._id === id)?.title || 'Unknown Series'}
          </span>
        </div>
      )}
    </div>
  );
}
