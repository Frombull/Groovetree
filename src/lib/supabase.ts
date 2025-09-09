import { env } from '@/app/lib/env';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for profile pictures
export const PROFILE_PICTURES_BUCKET = 'profile-pictures';

// File upload constraints
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadProfilePicture(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size must be less than 2MB'
      };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed'
      };
    }

    // Generate unique filename with user folder structure
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Failed to upload image'
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

export async function deleteProfilePicture(url: string): Promise<boolean> {
  try {
    // Extract the full path from URL (including user folder)
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === PROFILE_PICTURES_BUCKET);
    if (bucketIndex === -1 || bucketIndex === urlParts.length - 1) return false;

    // Get the path after the bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    if (!filePath) return false;

    const { error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}