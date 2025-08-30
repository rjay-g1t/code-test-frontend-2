import React from 'react';
import { ImageItem } from '../types';

interface ImageGridProps {
  images: ImageItem[];
  onImageClick: (image: ImageItem) => void;
  loading?: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onImageClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm">No images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {(images || []).map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onImageClick(image)}
        >
          <img
            src={`${API_BASE_URL}${image.thumbnail_path}`}
            alt={image.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />

          {/* Processing overlay */}
          {image.metadata?.ai_processing_status === 'pending' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                Processing...
              </div>
            </div>
          )}

          {/* Error overlay */}
          {image.metadata?.ai_processing_status === 'failed' && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                ⚠️
              </span>
            </div>
          )}

          {/* Hover overlay with filename */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-end">
            <div className="w-full p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium truncate">{image.filename}</p>
              {image.metadata?.tags && image.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {image.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white bg-opacity-20 px-1 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {image.metadata.tags.length > 3 && (
                    <span className="text-xs">
                      +{image.metadata.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
