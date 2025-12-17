'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  File,
  Image,
  FileText,
  Video,
  Music,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  userId: string;
  fileType?: 'RESUME' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
  associatedId?: string;
  associatedType?: string;
  tags?: string[];
  isPublic?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  s3Key: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}

const FileUploader: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = ['*/*'],
  userId,
  fileType = 'OTHER',
  associatedId,
  associatedType,
  tags = [],
  isPublic = false,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (fileType.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (fileType.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (fileType.includes('pdf') || fileType.includes('document'))
      return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type if specific types are required
    if (!acceptedFileTypes.includes('*/*')) {
      const isValidType = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type ${file.type} is not allowed`;
      }
    }

    return null;
  };

  const uploadFile = async (file: File, uploadingFileId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('userId', userId);

    if (associatedId) formData.append('associatedId', associatedId);
    if (associatedType) formData.append('associatedType', associatedType);
    if (tags.length > 0) formData.append('tags', tags.join(','));
    formData.append('isPublic', isPublic.toString());

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        const uploadedFile: UploadedFile = {
          id: uploadingFileId,
          name: result.fileName,
          size: result.fileSize,
          type: result.mimeType,
          url: result.fileUrl,
          s3Key: result.s3Key,
        };

        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFileId ? { ...f, status: 'success', progress: 100, uploadedFile } : f
          )
        );

        return uploadedFile;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFileId
            ? {
                ...f,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
      throw error;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      // Check max files limit
      if (uploadingFiles.length + fileArray.length > maxFiles) {
        onUploadError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: File[] = [];
      const errors: string[] = [];

      // Validate all files first
      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        onUploadError?.(errors.join('\n'));
        return;
      }

      // Create uploading file entries
      const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading',
      }));

      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

      // Upload files
      const uploadPromises = newUploadingFiles.map(async uploadingFile => {
        try {
          return await uploadFile(uploadingFile.file, uploadingFile.id);
        } catch (error) {
          console.error('Upload error:', error);
          return null;
        }
      });

      try {
        const results = await Promise.allSettled(uploadPromises);
        const successfulUploads = results
          .filter(
            (result): result is PromiseFulfilledResult<UploadedFile> =>
              result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        if (successfulUploads.length > 0) {
          onUploadSuccess?.(successfulUploads);
        }
      } catch (error) {
        console.error('Upload batch error:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      uploadingFiles.length,
      maxFiles,
      onUploadError,
      onUploadSuccess,
      maxFileSize,
      acceptedFileTypes,
      userId,
      fileType,
      associatedId,
      associatedType,
      tags,
      isPublic,
    ]
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
    // Reset input value to allow same file selection
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Maximum {maxFiles} files, up to {maxFileSize}MB each
        </p>
        {acceptedFileTypes.length > 0 && !acceptedFileTypes.includes('*/*') && (
          <p className="text-xs text-gray-400">Accepted: {acceptedFileTypes.join(', ')}</p>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept={acceptedFileTypes.join(',')}
      />

      {/* File List */}
      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Files</h4>
          {uploadingFiles.map(uploadingFile => (
            <div
              key={uploadingFile.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-gray-500">{getFileIcon(uploadingFile.file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadingFile.file.size)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadingFile.status === 'uploading' && (
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                  )}
                  {uploadingFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {uploadingFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeFile(uploadingFile.id);
                }}
                className="ml-3 p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
