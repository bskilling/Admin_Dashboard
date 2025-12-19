/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Trash2, AlertCircle, Loader, Check, Copy } from 'lucide-react';
import env from '@/lib/env';
import axios from 'axios';
import { toast } from 'sonner';
import { set } from 'lodash';

interface SingleImageUploaderProps {
  onUploadSuccess?: (file: UploadedImage) => void;
  onUploadError?: (error: string) => void;
  onDelete?: () => void;
  maxFileSize?: number; // in MB
  userId?: string;
  initialImage?: string; // URL of existing image
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  purpose?: string;
}

interface UploadedImage {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  s3Key?: string;
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
  purpose = 'default',
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage || null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedImage | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Image size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Only JPG, PNG, GIF, WebP, SVG files are allowed`;
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
      formData.append('purpose', purpose);
      formData.append('type', 'image');

      console.log('Sending request to /api/files...');

      const response = await axios.post(env.BACKEND_URL + '/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      const { _id, viewUrl } = response.data.data;

      const uploadedImage: UploadedImage = {
        id: _id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: viewUrl,
      };

      setFileId(_id);
      setCurrentImage(viewUrl);
      setImageUrl(viewUrl);
      setUploadedFile(uploadedImage);
      onUploadSuccess?.(uploadedImage);
      toast.success('Image uploaded successfully');
      console.log('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('Upload process finished');
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
        toast.error(validationError);
        return;
      }

      await uploadFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxFileSize, purpose, onUploadSuccess, onUploadError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      if (fileId) return; // Prevent drop if file already uploaded

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles, fileId]
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
    if (files && files.length > 0 && !fileId) {
      handleFiles(files);
    }
    e.target.value = '';
  };

  const handleDelete = async () => {
    if (!fileId) {
      // Just clear preview if no file ID
      setCurrentImage(null);
      setUploadedFile(null);
      setError(null);
      onDelete?.();
      return;
    }

    try {
      setIsUploading(true);
      await axios.delete(`${env.BACKEND_URL}/api/files/${fileId}`);

      setFileId(null);
      setCurrentImage(null);
      setUploadedFile(null);
      setError(null);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onDelete?.();
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting image');
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (!fileId) {
      fileInputRef.current?.click();
    }
  };

  const copyToClipboard = async () => {
    if (!imageUrl) return;

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`relative ${className} w-full`}>
      {/* Main Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${currentImage ? 'border-solid' : ''}
          ${fileId ? 'cursor-default' : 'cursor-pointer'}
        `}
        style={{ width: `${width}px`, height: `${height}px`, minWidth: '300px' }}
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
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    if (!fileId) {
                      openFileDialog();
                    }
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Change image"
                  disabled={!!fileId}
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
            <p className="text-xs text-gray-500">Max {maxFileSize}MB • JPG, PNG, GIF, WebP, SVG</p>
          </div>
        )}
      </div>

      {/* Delete Button (outside image for better UX when image is small) */}
      {currentImage && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-20"
          title="Delete image"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {imageUrl && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Image Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              placeholder="Image URL will appear here"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={handleFileSelect}
        disabled={!!fileId}
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
