"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { IoMdLink, IoMdSettings } from "react-icons/io";
import { MdEvent, MdLogout, MdSave, MdEdit } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import { RiShareFill } from "react-icons/ri";
import Image from "next/image";
import toast from "react-hot-toast";

interface PageData {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  links: Link[];
  events: Event[];
}

interface Link {
  id: string;
  title: string;
  url: string;
  type: string;
  order: number;
  isActive: boolean;
}

interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  state?: string | null;
  date: string;
  ticketUrl?: string | null;
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
    id: "music",
    name: "Music",
    icon: <FaSpotify className="w-4 h-4" />,
    items: [
      {
        type: "SPOTIFY",
        name: "Spotify",
        description: "Share your latest or favorite music",
        icon: <FaSpotify className="w-6 h-6 text-green-500" />,
      },
      {
        type: "APPLE_MUSIC",
        name: "Apple Music",
        description: "Share your Apple Music content",
        icon: <FaApple className="w-6 h-6 text-gray-700" />,
      },
      {
        type: "SOUNDCLOUD",
        name: "SoundCloud",
        description: "Share your SoundCloud tracks",
        icon: <FaSoundcloud className="w-6 h-6 text-orange-500" />,
      },
      {
        type: "YOUTUBE",
        name: "YouTube",
        description: "Share YouTube videos",
        icon: <FaYoutube className="w-6 h-6 text-red-500" />,
      },
      {
        type: "GENERIC",
        name: "Custom Music Link",
        description: "Add any music platform link",
        icon: <IoMdLink className="w-6 h-6 text-blue-500" />,
      },
    ],
  },
  {
    id: "social",
    name: "Social",
    icon: <FaInstagram className="w-4 h-4" />,
    items: [
      {
        type: "INSTAGRAM",
        name: "Instagram",
        description: "Link to your Instagram profile",
        icon: <FaInstagram className="w-6 h-6 text-pink-500" />,
      },
      {
        type: "TIKTOK",
        name: "TikTok",
        description: "Link to your TikTok profile",
        icon: <FaTiktok className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "other",
    name: "Other",
    icon: <IoMdLink className="w-4 h-4" />,
    items: [
      {
        type: "GENERIC",
        name: "Custom Link",
        description: "Add any custom link",
        icon: <IoMdLink className="w-6 h-6 text-blue-500" />,
      },
      {
        type: "TOUR",
        name: "Tour Dates",
        description: "Link to your tour schedule",
        icon: <MdEvent className="w-6 h-6 text-purple-500" />,
      },
    ],
  },
];

export default function EditPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("music");
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [linkForm, setLinkForm] = useState({
    title: "",
    url: "",
    type: "GENERIC",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    venue: "",
    city: "",
    state: "",
    date: "",
    ticketUrl: "",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [copied, setCopied] = useState(false);

  const createPage = useCallback(async () => {
    try {
      const response = await fetch("/api/page/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: user?.email?.split("@")[0] || "user",
          title: user?.name || "My Page",
          bio: "Bio do artista.",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      }
    } catch (error) {
      console.error("Error creating page:", error);
    }
  }, [user]);

  const fetchPageData = useCallback(async () => {
    try {
      const response = await fetch("/api/page/me");
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
        setEvents(data.events || []); // Popula os eventos
      } else {
        await createPage();
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      toast.error("Erro ao carregar página");
    } finally {
      setIsLoadingPage(false);
    }
  }, [createPage]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
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
      title: category?.name || "",
      url: "",
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
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      if (editingLink) {
        // Atualizar link existente
        const response = await fetch(`/api/links/${editingLink.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkForm),
        });

        if (response.ok) {
          toast.success("Link atualizado!");
          fetchPageData();
          setShowEditModal(false);
          setEditingLink(null);
        } else {
          toast.error("Erro ao atualizar link");
        }
      } else {
        // Criar novo link
        const response = await fetch("/api/links/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...linkForm,
            pageId: pageData?.id,
          }),
        });

        if (response.ok) {
          toast.success("Link adicionado!");
          fetchPageData();
          setShowEditModal(false);
        } else {
          toast.error("Erro ao adicionar link");
        }
      }
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error("Erro ao salvar link");
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Tem certeza que deseja deletar este link?")) return;

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Link deletado!");
        fetchPageData();
      } else {
        toast.error("Erro ao deletar link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Erro ao deletar link");
    }
  };

  // Funções para gerenciar eventos
  const handleSaveEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.venue ||
      !eventForm.city ||
      !eventForm.date
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events/create";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });

      if (response.ok) {
        toast.success(editingEvent ? "Show atualizado!" : "Show adicionado!");
        setShowEventModal(false);
        setEventForm({
          title: "",
          venue: "",
          city: "",
          state: "",
          date: "",
          ticketUrl: "",
        });
        setEditingEvent(null);
        fetchPageData();
      } else {
        toast.error("Erro ao salvar show");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Erro ao salvar show");
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      venue: event.venue,
      city: event.city,
      state: event.state || "",
      date: event.date.split("T")[0], // Formato YYYY-MM-DD
      ticketUrl: event.ticketUrl || "",
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Tem certeza que deseja deletar este show?")) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Show deletado!");
        fetchPageData();
      } else {
        toast.error("Erro ao deletar show");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Erro ao deletar show");
    }
  };

  const handleUpdatePage = async () => {
    try {
      const response = await fetch("/api/page/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageData?.title,
          bio: pageData?.bio,
        }),
      });

      if (response.ok) {
        toast.success("Página atualizada!");
      } else {
        toast.error("Erro ao atualizar página");
      }
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error("Erro ao atualizar página");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem deve ter menos de 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo deve ser uma imagem");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { avatarUrl } = await response.json();
        setPageData((prev) => (prev ? { ...prev, avatarUrl } : null));
        toast.success("Imagem atualizada!");
        fetchPageData();
      } else {
        toast.error("Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/${pageData?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
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
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
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
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-500 overflow-hidden">
              {pageData.avatarUrl ? (
                <Image
                  src={pageData.avatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <span>{pageData.title[0]}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading..." : "Choose Image"}
            </button>
          </div>

          {/* Profile Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Title
            </label>
            <input
              type="text"
              value={pageData.title}
              onChange={(e) =>
                setPageData({ ...pageData, title: e.target.value })
              }
              onBlur={handleUpdatePage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your artist name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={pageData.bio || ""}
              onChange={(e) =>
                setPageData({ ...pageData, bio: e.target.value })
              }
              onBlur={handleUpdatePage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Tell your audience about yourself"
            />
          </div>

          {/* Groovetree URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groovetree URL
            </label>
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

        {/* Shows Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MdEvent className="w-6 h-6 text-purple-600" />
            Shows & Events
          </h2>

          {/* Add Event Button */}
          <button
            onClick={() => {
              setEditingEvent(null);
              setEventForm({
                title: "",
                venue: "",
                city: "",
                state: "",
                date: "",
                ticketUrl: "",
              });
              setShowEventModal(true);
            }}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <FaPlus className="w-5 h-5" />
            Add New Show
          </button>

          {/* Events List */}
          <div className="space-y-3">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {event.venue} - {event.city}
                      {event.state ? `, ${event.state}` : ""}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {new Date(event.date).toLocaleDateString("pt-BR")}
                    </p>
                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 mt-1 inline-flex items-center gap-1"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        Ver ingressos
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit event"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete event"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-6xl mb-4">🎤</p>
                <p className="text-lg font-medium text-gray-700">
                  No shows yet
                </p>
                <p className="text-sm">
                  Click the button above to add your first show
                </p>
              </div>
            )}
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
                    <p className="font-medium text-gray-900 truncate">
                      {link.title}
                    </p>
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
                <p className="text-lg font-medium text-gray-700">
                  No links yet
                </p>
                <p className="text-sm">
                  Click the button above to add your first link
                </p>
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
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                        <p className="text-sm text-gray-500 truncate">
                          {item.description}
                        </p>
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
              <h2 className="text-2xl font-bold">
                {editingLink ? "Edit Link" : "New Link"}
              </h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={linkForm.title}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., My Spotify"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, url: e.target.value })
                  }
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  Compartilhe sua identidade musical
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <p className="text-purple-100">
                Mostre ao mundo sua música e conecte seus fãs a todas as suas
                plataformas em um só lugar!
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Groovetree URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`groovetree.vercel.app/${pageData?.slug}`}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <FaCopy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <RiShareFill className="w-5 h-5" />
                  Dicas para compartilhar:
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Adicione este link na bio do Instagram</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Compartilhe nas suas redes sociais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>
                      Use em cartões de visita e materiais promocionais
                    </span>
                  </li>
                </ul>
              </div>

              <Link
                href={`/${pageData?.slug}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <BsEyeFill className="w-4 h-4" />
                Visualizar Página
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal (Add/Edit) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdEvent className="w-6 h-6 text-purple-600" />
                {editingEvent ? "Edit Show" : "Add New Show"}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                  setEventForm({
                    title: "",
                    venue: "",
                    city: "",
                    state: "",
                    date: "",
                    ticketUrl: "",
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  placeholder="Ex: Summer Tour 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, venue: e.target.value })
                  }
                  placeholder="Ex: Estádio Mineirão"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={eventForm.city}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, city: e.target.value })
                    }
                    placeholder="Ex: Belo Horizonte"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={eventForm.state}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, state: e.target.value })
                    }
                    placeholder="Ex: MG"
                    maxLength={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Ticket URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket URL
                </label>
                <input
                  type="url"
                  value={eventForm.ticketUrl}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, ticketUrl: e.target.value })
                  }
                  placeholder="https://example.com/tickets"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link para compra de ingressos (opcional)
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveEvent}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <MdSave className="w-5 h-5" />
                {editingEvent ? "Update Show" : "Add Show"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
