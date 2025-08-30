import { uploadProfilePicture, deleteProfilePicture, UploadResult } from './supabase';

export interface ProfilePictureService {
  uploadAvatar: (file: File, userId: string, currentAvatarUrl?: string) => Promise<UploadResult>;
  deleteAvatar: (avatarUrl: string) => Promise<boolean>;
}

export const profilePictureService: ProfilePictureService = {
  async uploadAvatar(file: File, userId: string, currentAvatarUrl?: string): Promise<UploadResult> {
    try {
      // Upload new avatar
      const result = await uploadProfilePicture(file, userId);
      
      if (result.success && currentAvatarUrl) {
        // Delete old avatar if upload was successful
        await deleteProfilePicture(currentAvatarUrl);
      }
      
      return result;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: 'Failed to upload avatar'
      };
    }
  },

  async deleteAvatar(avatarUrl: string): Promise<boolean> {
    try {
      return await deleteProfilePicture(avatarUrl);
    } catch (error) {
      console.error('Avatar delete error:', error);
      return false;
    }
  }
};