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
  FaFacebook,
  FaHeart,
} from "react-icons/fa";
import { IoMdSettings, IoMdMusicalNote } from "react-icons/io";
import {
  MdEvent,
  MdLogout,
  MdSave,
  MdEdit,
  MdPhotoLibrary,
} from "react-icons/md";
import { BsEyeFill, BsTwitterX } from "react-icons/bs";
import { RiShareFill } from "react-icons/ri";
import Image from "next/image";
import toast from "react-hot-toast";

interface PageData {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  backgroundImageUrl: string | null;
  links: Link[];
  events: Event[];
  photos: Photo[];
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

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
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
    id: "music",
    name: "Music",
    icon: <IoMdMusicalNote className="w-4 h-4" />,
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
    ],
  },
  {
    id: "social",
    name: "Social",
    icon: <FaHeart className="w-4 h-4" />,
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
      {
        type: "FACEBOOK",
        name: "Facebook",
        description: "Link to your Facebook page",
        icon: <FaFacebook className="w-6 h-6 text-blue-600" />,
      },
      {
        type: "TWITTER",
        name: "X (Twitter)",
        description: "Link to your X profile",
        icon: <BsTwitterX className="w-6 h-6" />,
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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("music");
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
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
  const [photoForm, setPhotoForm] = useState({
    imageUrl: "",
    caption: "",
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
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
        setPhotos(data.photos || []); // Popula as fotos
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

  // Photo Management Functions
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF");
      return;
    }

    // Validar tamanho (10MB para melhor qualidade)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 10MB");
      return;
    }

    setUploadingPhoto(true);

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPhotoForm({ ...photoForm, imageUrl: data.url });
        toast.success("Imagem carregada!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao fazer upload");
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Erro ao fazer upload da imagem");
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoForm.imageUrl || !pageData) {
      toast.error("Por favor, faça upload de uma imagem primeiro");
      return;
    }

    // Limite de 4 fotos
    if (!editingPhoto && photos.length >= 4) {
      toast.error("Máximo de 4 fotos permitidas");
      return;
    }

    try {
      const url = editingPhoto
        ? `/api/photos/${editingPhoto.id}`
        : "/api/photos/create";
      const method = editingPhoto ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: photoForm.imageUrl,
          caption: photoForm.caption || null,
          pageId: pageData.id,
        }),
      });

      if (response.ok) {
        toast.success(editingPhoto ? "Foto atualizada!" : "Foto adicionada!");
        setShowPhotoModal(false);
        setEditingPhoto(null);
        setPhotoForm({ imageUrl: "", caption: "" });
        fetchPageData();
      } else {
        toast.error("Erro ao salvar foto");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Erro ao salvar foto");
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      imageUrl: photo.imageUrl,
      caption: photo.caption || "",
    });
    setPhotoPreview(null); // Usa a URL existente
    setShowPhotoModal(true);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta foto?")) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Foto deletada!");
        fetchPageData();
      } else {
        toast.error("Erro ao deletar foto");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Erro ao deletar foto");
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
          backgroundColor: pageData?.backgroundColor,
          textColor: pageData?.textColor,
          backgroundImageUrl: pageData?.backgroundImageUrl,
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
              href=""
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoMdSettings className="w-5 h-5" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
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
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 hover:cursor-pointer"
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
              <span className="text-gray-500 text-sm">
                groovetree.vercel.app/
              </span>
              <input
                type="text"
                value={pageData.slug}
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <IoMdSettings className="w-6 h-6 text-purple-600" />
            Personalização da Página
          </h2>

          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Fundo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={pageData?.backgroundColor || "#000000"}
                  onChange={(e) =>
                    setPageData({
                      ...pageData!,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData?.backgroundColor || "#000000"}
                  onChange={(e) =>
                    setPageData({
                      ...pageData!,
                      backgroundColor: e.target.value,
                    })
                  }
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Texto
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={pageData?.textColor || "#ffffff"}
                  onChange={(e) =>
                    setPageData({
                      ...pageData!,
                      textColor: e.target.value,
                    })
                  }
                  className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData?.textColor || "#ffffff"}
                  onChange={(e) =>
                    setPageData({
                      ...pageData!,
                      textColor: e.target.value,
                    })
                  }
                  placeholder="#ffffff"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Background Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem de Fundo
              </label>
              <input
                type="url"
                value={pageData?.backgroundImageUrl || ""}
                onChange={(e) =>
                  setPageData({
                    ...pageData!,
                    backgroundImageUrl: e.target.value,
                  })
                }
                placeholder="https://example.com/background.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe vazio para usar apenas a cor de fundo
              </p>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div
                className="h-24 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: pageData?.backgroundColor || "#000000",
                  backgroundImage: pageData?.backgroundImageUrl
                    ? `url(${pageData.backgroundImageUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: pageData?.textColor || "#ffffff",
                }}
              >
                <p className="font-semibold text-lg drop-shadow-lg">
                  Texto de exemplo
                </p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdatePage}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <MdSave className="w-5 h-5" />
              Salvar Personalização
            </button>
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

        {/* Photo Gallery Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MdPhotoLibrary className="w-6 h-6 text-purple-600" />
            Photo Gallery
          </h2>

          {/* Add Photo Button */}
          <button
            onClick={() => {
              setEditingPhoto(null);
              setPhotoForm({ imageUrl: "", caption: "" });
              setPhotoPreview(null);
              setShowPhotoModal(true);
            }}
            disabled={photos.length >= 4}
            className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-6 ${
              photos.length >= 4
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            <FaPlus className="w-5 h-5" />
            Add Photo {photos.length >= 4 && "(Máximo atingido)"}
          </button>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos && photos.length > 0 ? (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || "Photo"}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                      {photo.caption}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPhoto(photo)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                      title="Edit photo"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                      title="Delete photo"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 sm:col-span-4 text-center py-16 text-gray-400">
                <p className="text-6xl mb-4">📸</p>
                <p className="text-lg font-medium text-gray-700">
                  Nenhuma foto ainda
                </p>
                <p className="text-sm">Adicione até 4 fotos para a galeria</p>
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold">Add Link</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 p-4 border-b border-gray-200/50 overflow-x-auto">
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center">
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

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdPhotoLibrary className="w-6 h-6 text-purple-600" />
                {editingPhoto ? "Edit Photo" : "Add New Photo"}
              </h2>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setEditingPhoto(null);
                  setPhotoForm({ imageUrl: "", caption: "" });
                  setPhotoPreview(null);
                  if (photoInputRef.current) {
                    photoInputRef.current.value = "";
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP ou GIF (máx. 10MB para melhor qualidade)
                </p>
              </div>

              {/* Image Preview */}
              {(photoPreview || photoForm.imageUrl) && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={photoPreview || photoForm.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={photoForm.caption}
                  onChange={(e) =>
                    setPhotoForm({ ...photoForm, caption: e.target.value })
                  }
                  placeholder="Ex: Show em São Paulo 2024"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Texto que aparece sobre a foto (opcional, máx. 100 caracteres)
                </p>
              </div>

              {/* Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  💡 <strong>Dica:</strong> Use imagens com proporção quadrada
                  (1:1) para melhor visualização. Máximo de 4 fotos.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePhoto}
                disabled={uploadingPhoto || !photoForm.imageUrl}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave className="w-5 h-5" />
                {uploadingPhoto
                  ? "Uploading..."
                  : editingPhoto
                  ? "Update Photo"
                  : "Add Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
