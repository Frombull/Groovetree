'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaCamera, FaTrash, FaUpload } from 'react-icons/fa';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'md' 
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
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
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 group-hover:border-purple-300 dark:group-hover:border-purple-400 transition-colors relative ${
            isDragging ? 'border-purple-500 bg-purple-50 dark:bg-purple-900' : ''
          }`}
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
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer">
            <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 bg-purple-500 dark:bg-purple-600 text-white p-2 rounded-full hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg cursor-pointer"
        >
          <FaUpload className="w-3 h-3" />
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center cursor-pointer"
        >
          <FaUpload className="mr-2 w-3 h-3" />
          Change profile picture
        </button>
        
        {(preview || currentAvatar) && (
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center"
          >
            <FaTrash className="mr-2 w-3 h-3" />
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Drag an image or click to upload (max. 2MB).
      </p>
    </div>
  );
}