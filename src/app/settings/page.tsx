'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Header from '@/app/components/header';
import AvatarUpload from '@/app/components/AvatarUpload';
import AccountStats from '@/app/components/AccountStats';
import DataExport from '@/app/components/DataExport';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUser, 
  FaLock, 
  FaBell, 
  FaPalette, 
  FaGlobe, 
  FaTrash,
  FaSave,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaDatabase,
  FaSun,
  FaMoon,
  FaDesktop
} from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';

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
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
    },
    theme: 'auto',
    language: 'pt-BR',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO
      toast.success('TODO')
    } catch (error) {
      toast.error("This didn't work.")
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!.")
      return;
    }
    if (passwordData.newPassword.length < 3) {
      toast.error("Passwords too short.")
      return;
    }
    setIsSaving(true);
    try {
      toast.success('TODO')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error("Error altering password.")
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy', icon: FaShield },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'language', label: 'Language', icon: FaGlobe },
    { id: 'data', label: 'Data', icon: FaDatabase },
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
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
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
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Information</h2>
                  
                  {/* Profile picture upload */}
                  <div className="flex justify-center py-6">
                    <AvatarUpload
                      currentAvatar={user?.page?.avatarUrl}
                      onAvatarChange={(file) => {
                        // TODO
                        toast.success('TODO')
                        console.log('Avatar file:', file);
                      }}
                      size="lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={settings.bio}
                        onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={settings.website}
                        onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://seusite.com"
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Tab: Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Account Security</h2>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                    <FaShield className="text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      AAAAAAAAAAAAAAAAAAAAA
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Curent password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="New Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Confirm New Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaLock className="mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Password'}
                  </button>
                </div>
              )}         
              {/* Tab: Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive important updates by email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, push: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Marketing and Promotions</h3>
                        <p className="text-sm text-gray-600">Receive special offers and news</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketing}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, marketing: e.target.checked }
                          }))}
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Tab: Privacy */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Public Profile</h3>
                        <p className="text-sm text-gray-600">Allow other users to view your artist profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.profilePublic}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, profilePublic: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Email</h3>
                        <p className="text-sm text-gray-600">Show your email on your public profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showEmail}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, showEmail: e.target.checked }
                          }))}
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Tab: Data */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Data and Privacy</h2>
                  
                  <DataExport />
                </div>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="border-t border-gray-200 p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-red-700 mb-4">
                These actions are irreversible. Be sure before proceeding.
              </p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                <FaTrash className="mr-2" />
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}