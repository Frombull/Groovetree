'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaCamera, FaTrash, FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File | null) => void;
  size?: 'sm' | 'md' | 'lg';
  isUploading?: boolean;
}

export default function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  size = 'md',
  isUploading = false
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onAvatarChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || currentAvatar || '/default-profile-picture.png';

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 transition-colors relative ${error
              ? 'border-red-400 dark:border-red-500'
              : isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                : 'border-gray-200 dark:border-gray-600 group-hover:border-purple-300 dark:group-hover:border-purple-400'
            } ${isUploading ? 'opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Image
            src={displayImage}
            alt="Avatar"
            width={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            height={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 bg-purple-500 dark:bg-purple-600 text-white p-2 rounded-full hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaUpload className="w-3 h-3" />
          )}
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="w-3 h-3 mr-2 border border-gray-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaUpload className="mr-2 w-3 h-3" />
          )}
          {isUploading ? 'Uploading...' : 'Change profile picture'}
        </button>

        {(preview || currentAvatar) && !isUploading && (
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm flex items-center"
          >
            <FaTrash className="mr-2 w-3 h-3" />
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <FaExclamationTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Drag an image or click to upload. Max 2MB. Supports JPEG, PNG, WebP.
      </p>
    </div>
  );
}