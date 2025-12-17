/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Trash2, AlertCircle, Loader } from 'lucide-react';

interface SingleImageUploaderProps {
  onUploadSuccess?: (file: UploadedImage) => void;
  onUploadError?: (error: string) => void;
  onDelete?: () => void;
  maxFileSize?: number; // in MB
  userId: string;
  initialImage?: string; // URL of existing image
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number; // JPEG quality 0-100
}

interface UploadedImage {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  s3Key: string;
}

const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onDelete,
  maxFileSize = 5, // 5MB default
  userId,
  initialImage,
  placeholder = 'Click to upload or drag image here',
  className = '',
  width = 300,
  height = 200,
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Image size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Only ${acceptedTypes.join(', ')} files are allowed`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    console.log('Starting upload for file:', file.name, file.size, file.type);
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'IMAGE');
      formData.append('userId', userId);
      formData.append('isPublic', 'true');

      console.log('Sending request to /api/files...');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        console.error('Upload failed with error:', errorData);
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      if (result.success) {
        const uploadedImage: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          name: result.fileName,
          size: result.fileSize,
          type: result.mimeType,
          url: result.fileUrl,
          s3Key: result.s3Key,
        };

        setCurrentImage(result.fileUrl);
        setUploadedFile(uploadedImage);
        onUploadSuccess?.(uploadedImage);
        console.log('Upload successful!');
      } else {
        throw new Error(result.error || 'Upload failed - no success flag');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      console.log('Upload process finished, setting loading to false');
      setIsUploading(false);
    }
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        onUploadError?.(validationError);
        return;
      }

      await uploadFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxFileSize, userId, onUploadSuccess, onUploadError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  };

  const handleDelete = () => {
    setCurrentImage(null);
    setUploadedFile(null);
    setError(null);
    onDelete?.();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className} w-full`}>
      {/* Main Upload Area */}
      <div
        className={`!min-w-[500px]
          relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${currentImage ? 'border-solid' : ''}
        `}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={currentImage ? undefined : openFileDialog}
      >
        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Uploading...</p>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {currentImage ? (
          <div className="relative w-full h-full group">
            <img src={currentImage} alt="Uploaded preview" className="w-full h-full object-cover" />

            {/* Overlay with actions */}
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Change image"
                >
                  <Camera className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Placeholder */
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">Max {maxFileSize}MB • JPG, PNG, GIF, WebP</p>
          </div>
        )}
      </div>

      {/* Delete Button (outside image for better UX when image is small) */}
      {currentImage && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-20"
          title="Delete image"
        >
          <X className="w-4 h-4" />
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
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {/* File Info */}
      {uploadedFile && (
        <div className="mt-2 text-xs text-gray-500">
          <p className="truncate">{uploadedFile.name}</p>
          <p>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
};

export default SingleImageUploader;
