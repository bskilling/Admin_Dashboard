/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader, AlertCircle } from 'lucide-react';

interface SimpleUploaderProps {
  onUpload: (fileId: string) => void;
  onDelete?: () => void;
  userId: string;
  initialImage?: string;
  className?: string;
}

const SimpleUploader: React.FC<SimpleUploaderProps> = ({
  onUpload,
  onDelete,
  userId,
  initialImage,
  className = '',
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxFileSize = 5; // 5MB

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Image size exceeds ${maxFileSize}MB limit`;
    }

    if (!acceptedTypes.includes(file.type)) {
      return 'Only JPG, PNG, GIF, WebP files are allowed';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'IMAGE');
      formData.append('userId', userId);
      formData.append('isPublic', 'true');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCurrentImage(result.fileUrl);
        // Pass the file _id to parent component
        onUpload(result.fileUrl);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    uploadFile(file);
    e.target.value = '';
  };

  const handleDelete = () => {
    setCurrentImage(null);
    setError(null);
    onDelete?.();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Upload Area */}
      <div
        className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
        onClick={openFileDialog}
      >
        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <Loader className="w-6 h-6 animate-spin text-white" />
          </div>
        )}

        {/* Image Preview */}
        {currentImage ? (
          <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          /* Upload Placeholder */
          <div className="flex flex-col items-center justify-center h-full p-2 text-center">
            <Upload className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-xs text-gray-500">Click to upload</p>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {currentImage && (
        <button
          onClick={e => {
            e.stopPropagation();
            handleDelete();
          }}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-20"
          title="Delete image"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center text-xs text-red-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default SimpleUploader;

// Usage:
/*
function MyForm() {
  const [imageId, setImageId] = useState<string>("");

  return (
    <SimpleUploader
      onUpload={(fileId) => setImageId(fileId)}
      onDelete={() => setImageId("")}
      userId="user123"
    />
  );
}
*/
