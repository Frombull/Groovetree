'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaPlus,
  FaTimes,
  FaGripVertical,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaSpotify,
  FaTrash,
  FaExternalLinkAlt,
  FaSoundcloud,
  FaApple,
} from 'react-icons/fa';
import { IoMdLink, IoMdSettings } from 'react-icons/io';
import { MdEvent, MdLogout, MdSave, MdEdit } from 'react-icons/md';
import { BsEyeFill } from 'react-icons/bs';
import { RiShareFill } from 'react-icons/ri';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface PageData {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  links: Link[];
}

interface Link {
  id: string;
  title: string;
  url: string;
  type: string;
  order: number;
  isActive: boolean;
}

interface LinkCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: LinkTypeItem[];
}

interface LinkTypeItem {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const linkCategories: LinkCategory[] = [
  {
    id: 'music',
    name: 'Music',
    icon: <FaSpotify className="w-4 h-4" />,
    items: [
      {
        type: 'SPOTIFY',
        name: 'Spotify',
        description: 'Share your latest or favorite music',
        icon: <FaSpotify className="w-6 h-6 text-green-500" />,
      },
      {
        type: 'APPLE_MUSIC',
        name: 'Apple Music',
        description: 'Share your Apple Music content',
        icon: <FaApple className="w-6 h-6 text-gray-700" />,
      },
      {
        type: 'SOUNDCLOUD',
        name: 'SoundCloud',
        description: 'Share your SoundCloud tracks',
        icon: <FaSoundcloud className="w-6 h-6 text-orange-500" />,
      },
      {
        type: 'YOUTUBE',
        name: 'YouTube',
        description: 'Share YouTube videos',
        icon: <FaYoutube className="w-6 h-6 text-red-500" />,
      },
      {
        type: 'GENERIC',
        name: 'Custom Music Link',
        description: 'Add any music platform link',
        icon: <IoMdLink className="w-6 h-6 text-blue-500" />,
      },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    icon: <FaInstagram className="w-4 h-4" />,
    items: [
      {
        type: 'INSTAGRAM',
        name: 'Instagram',
        description: 'Link to your Instagram profile',
        icon: <FaInstagram className="w-6 h-6 text-pink-500" />,
      },
      {
        type: 'TIKTOK',
        name: 'TikTok',
        description: 'Link to your TikTok profile',
        icon: <FaTiktok className="w-6 h-6" />,
      },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    icon: <IoMdLink className="w-4 h-4" />,
    items: [
      {
        type: 'GENERIC',
        name: 'Custom Link',
        description: 'Add any custom link',
        icon: <IoMdLink className="w-6 h-6 text-blue-500" />,
      },
      {
        type: 'TOUR',
        name: 'Tour Dates',
        description: 'Link to your tour schedule',
        icon: <MdEvent className="w-6 h-6 text-purple-500" />,
      },
    ],
  },
];

export default function EditPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('music');
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', type: 'GENERIC' });

  const createPage = useCallback(async () => {
    try {
      const response = await fetch('/api/page/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: user?.email?.split('@')[0] || 'user',
          title: user?.name || 'My Page',
          bio: 'Bio do artista.',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      }
    } catch (error) {
      console.error('Error creating page:', error);
    }
  }, [user]);

  const fetchPageData = useCallback(async () => {
    try {
      const response = await fetch('/api/page/me');
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      } else {
        await createPage();
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Erro ao carregar página');
    } finally {
      setIsLoadingPage(false);
    }
  }, [createPage]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchPageData();
    }
  }, [user, fetchPageData]);

  const handleAddLink = (linkType: string) => {
    const category = linkCategories
      .flatMap((cat) => cat.items)
      .find((item) => item.type === linkType);

    setLinkForm({
      title: category?.name || '',
      url: '',
      type: linkType,
    });
    setShowAddModal(false);
    setShowEditModal(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      type: link.type,
    });
    setShowEditModal(true);
  };

  const handleSaveLink = async () => {
    if (!linkForm.title || !linkForm.url) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      if (editingLink) {
        // Atualizar link existente
        const response = await fetch(`/api/links/${editingLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkForm),
        });

        if (response.ok) {
          toast.success('Link atualizado!');
          fetchPageData();
          setShowEditModal(false);
          setEditingLink(null);
        } else {
          toast.error('Erro ao atualizar link');
        }
      } else {
        // Criar novo link
        const response = await fetch('/api/links/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...linkForm,
            pageId: pageData?.id,
          }),
        });

        if (response.ok) {
          toast.success('Link adicionado!');
          fetchPageData();
          setShowEditModal(false);
        } else {
          toast.error('Erro ao adicionar link');
        }
      }
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('Erro ao salvar link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Link deletado!');
        fetchPageData();
      } else {
        toast.error('Erro ao deletar link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Erro ao deletar link');
    }
  };

  const handleUpdatePage = async () => {
    try {
      const response = await fetch('/api/page/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageData?.title,
          bio: pageData?.bio,
        }),
      });

      if (response.ok) {
        toast.success('Página atualizada!');
      } else {
        toast.error('Erro ao atualizar página');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error('Erro ao atualizar página');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading || isLoadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!pageData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
              Groovetree
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <RiShareFill className="w-5 h-5" />
              Share
            </button>

            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoMdSettings className="w-5 h-5" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <MdLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Link
              href={`/${pageData.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <BsEyeFill className="w-4 h-4" />
              Preview Page
            </Link>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-500">
              {pageData.avatarUrl ? (
                <Image
                  src={pageData.avatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <span>{pageData.title[0]}</span>
              )}
            </div>
            <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              Choose Image
            </button>
          </div>

          {/* Profile Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Title</label>
            <input
              type="text"
              value={pageData.title}
              onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              onBlur={handleUpdatePage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your artist name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={pageData.bio || ''}
              onChange={(e) => setPageData({ ...pageData, bio: e.target.value })}
              onBlur={handleUpdatePage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Tell your audience about yourself"
            />
          </div>

          {/* Groovetree URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Groovetree URL</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">groovetree.com/</span>
              <input
                type="text"
                value={pageData.slug}
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Links</h2>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <FaPlus className="w-5 h-5" />
            Add New Link
          </button>

          {/* Links List */}
          <div className="space-y-3">
            {pageData.links && pageData.links.length > 0 ? (
              pageData.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <FaGripVertical className="text-gray-400 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{link.title}</p>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                      <FaExternalLinkAlt className="w-3 h-3" />
                      {link.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit link"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete link"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-6xl mb-4">🎵</p>
                <p className="text-lg font-medium text-gray-700">No links yet</p>
                <p className="text-sm">Click the button above to add your first link</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Add Link</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto">
              {linkCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {linkCategories
                  .find((cat) => cat.id === selectedCategory)
                  ?.items.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddLink(item.type)}
                      className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                      </div>
                      <FaPlus className="text-gray-400 group-hover:text-purple-600 w-5 h-5 flex-shrink-0" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Link Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">{editingLink ? 'Edit Link' : 'New Link'}</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLink(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., My Spotify"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLink(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLink}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MdSave className="w-5 h-5" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
