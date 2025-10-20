"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/contexts/ThemeContext";
import Header from "@/app/components/header";
import AvatarUpload from "@/app/components/AvatarUpload";
import AccountStats from "@/app/components/AccountStats";
import DataExport from "@/app/components/DataExport";
import { profilePictureService } from "@/lib/profilePicture";
import toast from "react-hot-toast";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaGlobe,
  FaTrash,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaDatabase,
  FaSun,
  FaMoon,
  FaDesktop,
} from "react-icons/fa";
import { FaShield } from "react-icons/fa6";

interface UserSettings {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showEmail: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: string;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
    },
    theme: theme,
    language: "en-US",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      setCurrentAvatarUrl(user.page?.avatarUrl || null);
    }
  }, [user]);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      theme: theme,
    }));
  }, [theme]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      toast.success("handleSave");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    toast.success(
      `Theme changed to ${
        newTheme === "auto" ? "system preference" : newTheme
      } mode!`
    );
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    if (!file) {
      // Handle avatar removal
      if (currentAvatarUrl) {
        setIsUploadingAvatar(true);
        try {
          const success = await profilePictureService.deleteAvatar(
            currentAvatarUrl
          );
          if (success) {
            setCurrentAvatarUrl(null);
            toast.success("Profile picture removed successfully");
            // TODO: Update user profile in database
          } else {
            toast.error("Failed to remove profile picture");
          }
        } catch (err) {
          console.error("Error removing avatar:", err);
          toast.error("Error removing profile picture");
        } finally {
          setIsUploadingAvatar(false);
        }
      }
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await profilePictureService.uploadAvatar(
        file,
        user.id,
        currentAvatarUrl || undefined
      );

      if (result.success && result.url) {
        setCurrentAvatarUrl(result.url);
        toast.success("Profile picture updated successfully!");
        // TODO: Update user profile in database with new avatar URL
      } else {
        toast.error(result.error || "Failed to upload profile picture");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Error uploading profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!.");
      return;
    }
    if (passwordData.newPassword.length < 3) {
      toast.error("Passwords too short.");
      return;
    }
    setIsSaving(true);
    try {
      toast.success("TODO");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Error altering password.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: FaShield },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "language", label: "Language", icon: FaGlobe },
    { id: "data", label: "Data", icon: FaDatabase },
    { id: "delete_account", label: "Delete Account", icon: FaTrash },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="container mx-auto px-8 md:px-16 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-4xl shadow-lg overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 dark:text-gray-100">
              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Profile Information
                  </h2>

                  {/* Profile picture and basic info */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center my-8">
                    <div className="md:col-span-2 flex justify-center">
                      <AvatarUpload
                        currentAvatar={currentAvatarUrl}
                        onAvatarChange={handleAvatarChange}
                        size="lg"
                        isUploading={isUploadingAvatar}
                      />
                    </div>

                    {/* Name and Email fields */}
                    <div className="md:col-span-3 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={settings.bio}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:italic"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:italic"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={settings.website}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:italic"
                        placeholder="https://yoursite.com"
                      />
                    </div>
                  </div>

                  {/* Account stats */}
                  <AccountStats />

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center cursor-pointer"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSave className="mr-2 " />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Tab: Security */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Account Security
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 pr-12 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 pr-12 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="New Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Confirm New Password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={
                      isSaving ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaLock className="mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Password"}
                  </button>
                </div>
              )}
              {/* Tab: Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive important updates by email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          Push Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                push: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          Marketing and Promotions
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive special offers and news
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketing}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                marketing: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Tab: Privacy */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          Cool Option
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Description
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showEmail}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                showEmail: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Tab: Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Appearance
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Theme
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Choose how the interface looks. Auto will match your
                        system preference.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Light Theme */}
                        <button
                          onClick={() => handleThemeChange("light")}
                          className={`py-8 p-4 border-2 rounded-lg transition-all cursor-pointer ${
                            theme === "light"
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <FaSun className="w-5 h-5 text-yellow-500" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Light
                            </span>
                            {theme === "light" && (
                              <FaCheck className="w-4 h-4 text-purple-500 ml-auto" />
                            )}
                          </div>
                          <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                            <div className="h-2 bg-gray-100 rounded mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Bright interface
                          </p>
                        </button>

                        {/* Dark Theme */}
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className={`py-8 p-4 border-2 rounded-lg transition-all cursor-pointer ${
                            theme === "dark"
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <FaMoon className="w-5 h-5 text-blue-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Dark
                            </span>
                            {theme === "dark" && (
                              <FaCheck className="w-4 h-4 text-purple-500 ml-auto" />
                            )}
                          </div>
                          <div className="bg-gray-800 border border-gray-700 rounded p-2 mb-2">
                            <div className="h-2 bg-gray-700 rounded mb-1"></div>
                            <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Easy on the eyes
                          </p>
                        </button>

                        {/* Auto Theme */}
                        <button
                          onClick={() => handleThemeChange("auto")}
                          className={`py-8 p-4 border-2 rounded-lg transition-all cursor-pointer ${
                            theme === "auto"
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <FaDesktop className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Auto
                            </span>
                            {theme === "auto" && (
                              <FaCheck className="w-4 h-4 text-purple-500 ml-auto" />
                            )}
                          </div>
                          <div className="flex rounded overflow-hidden mb-2">
                            <div className="bg-white border-r border-gray-300 p-2 flex-1">
                              <div className="h-2 bg-gray-100 rounded mb-1"></div>
                              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="bg-gray-800 p-2 flex-1">
                              <div className="h-2 bg-gray-700 rounded mb-1"></div>
                              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Matches system preference
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Language */}
              {activeTab === "language" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Language Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Interface Language
                      </label>
                      <select
                        disabled
                        value={settings.language}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:text-gray-300 disabled:italic"
                      >
                        <option value="en-US">English</option>
                        <option value="pt-BR">Português</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center cursor-pointer"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Tab: Data */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Data and Privacy
                  </h2>
                  <DataExport />
                </div>
              )}

              {/* Tab: DeleteAccount */}
              {activeTab === "delete_account" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Delete your Groovetree account
                  </h2>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <FaTrash className="text-red-700 dark:red-900 mr-2" />
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                        Danger Zone Copy
                      </h3>
                    </div>
                    <p className="text-red-700 dark:text-red-300 mb-4">
                      These actions are irreversible. Be sure before proceeding.
                    </p>
                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center cursor-pointer">
                      <FaTrash className="mr-2" />
                      Delete account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
