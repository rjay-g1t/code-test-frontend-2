import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ImageItem } from '../types';
import { apiService } from '../services/api';

interface ImageModalProps {
  image: ImageItem;
  onClose: () => void;
  onSimilarImages: (images: ImageItem[]) => void;
  onColorFilter: (images: ImageItem[]) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onSimilarImages,
  onColorFilter,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFindSimilar = async () => {
    setLoading(true);
    try {
      const similarImages = await apiService.findSimilarImages(image.id);
      onSimilarImages(similarImages);
      onClose();
    } catch (error) {
      console.error('Failed to find similar images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorFilter = async (color: string) => {
    setLoading(true);
    try {
      const filteredImages = await apiService.filterByColor(color);
      onColorFilter(filteredImages);
      onClose();
    } catch (error) {
      console.error('Failed to filter by color:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {image.filename}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={`${API_BASE_URL}${image.original_path}`}
                  alt={image.filename}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                {/* Description */}
                {image.metadata?.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600">
                      {image.metadata.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {image.metadata?.tags && image.metadata.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {image.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {image.metadata?.colors && image.metadata.colors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Dominant Colors
                    </h4>
                    <div className="flex gap-2">
                      {image.metadata.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorFilter(color)}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          title={`Filter by ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Uploaded
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(image.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Processing status */}
                {image.metadata?.ai_processing_status && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      AI Status
                    </h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        image.metadata.ai_processing_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : image.metadata.ai_processing_status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {image.metadata.ai_processing_status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleFindSimilar}
              disabled={
                loading ||
                !image.metadata?.tags ||
                image.metadata.tags.length === 0
              }
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finding...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Find Similar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
