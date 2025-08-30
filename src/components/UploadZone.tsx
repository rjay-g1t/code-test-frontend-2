import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';

interface UploadZoneProps {
  onUploadComplete: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setProgress(0);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + Math.random() * 30;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 200);

        await apiService.uploadImages(acceptedFiles);

        clearInterval(progressInterval);
        setProgress(100);

        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          onUploadComplete();
        }, 500);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploading(false);
        setProgress(0);
        alert('Upload failed. Please try again.');
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />

        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />

        {uploading ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Uploading images...</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {Math.round(progress)}%
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                'Drop the images here...'
              ) : (
                <>
                  Drag & drop images here, or{' '}
                  <span className="text-indigo-600 font-medium">browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPEG and PNG files
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
