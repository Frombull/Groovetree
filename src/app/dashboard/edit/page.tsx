"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Aurora from "@/app/components/Aurora";
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
  FaWhatsapp,
  FaEnvelope,
  FaRedditAlien,
  FaLinkedin,
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
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalPageData, setOriginalPageData] = useState<PageData | null>(null);

  const createPage = useCallback(async () => {
    try {
      const response = await fetch("/api/page/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: user?.email?.split("@")[0] || "user",
          title: user?.name || "My Page",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      } else {
        const errorData = await response.json();
        console.error("Error creating page:", errorData);
        if (errorData.error === "User already has a page") {
          console.log("User already has a page, trying to fetch it...");
          // Se o usuário já tem uma página, tenta buscar ela
          const fetchResponse = await fetch("/api/page/me");
          if (fetchResponse.ok) {
            const data = await fetchResponse.json();
            setPageData(data);
          }
        }
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
        setOriginalPageData(data); // Salva os dados originais
        setEvents(data.events || []); // Popula os eventos
        setPhotos(data.photos || []); // Popula as fotos
        setHasUnsavedChanges(false); // Reset unsaved changes
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
        toast.success("Changes saved!");
        setOriginalPageData(pageData); // Update original data
        setHasUnsavedChanges(false); // Reset unsaved changes
      } else {
        toast.error("Error updating page");
      }
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error("Error updating page");
    }
  };

  const checkForUnsavedChanges = (newPageData: PageData) => {
    if (!originalPageData) return;

    const hasChanges =
      newPageData.title !== originalPageData.title ||
      newPageData.bio !== originalPageData.bio ||
      newPageData.backgroundColor !== originalPageData.backgroundColor ||
      newPageData.textColor !== originalPageData.textColor ||
      newPageData.backgroundImageUrl !== originalPageData.backgroundImageUrl;

    setHasUnsavedChanges(hasChanges);
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
      toast.error("Images should me < 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("File should be an image");
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
        toast.success("Image updated!");
        fetchPageData();
      } else {
        toast.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/${pageData?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareUrl = () => `${window.location.origin}/${pageData?.slug}`;
  const getShareText = () => `Check out my Groovetree page!`;

  const socialPlatforms = [
    {
      name: "X",
      icon: <BsTwitterX className="w-6 h-6" />,
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-6 h-6" />,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-6 h-6" />,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(`${getShareText()} ${getShareUrl()}`)}`,
    },
    {
      name: "Email",
      icon: <FaEnvelope className="w-6 h-6" />,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodeURIComponent("Check out my Groovetree page!")}&body=${encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`)}`,
    },
    {
      name: "Reddit",
      icon: <FaRedditAlien className="w-6 h-6" />,
      color: "bg-orange-600 hover:bg-orange-700",
      url: `https://reddit.com/submit?title=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(getShareText())} ${encodeURIComponent(getShareUrl())}`,
    },
  ];

  const handleSocialShare = (url: string) => {
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedItem(linkId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault();
    setDragOverItem(linkId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault();
    setDragOverItem(null);

    if (!draggedItem || !pageData || draggedItem === targetLinkId) {
      return;
    }

    const links = [...pageData.links];
    const draggedIndex = links.findIndex((l) => l.id === draggedItem);
    const targetIndex = links.findIndex((l) => l.id === targetLinkId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder array
    const [removed] = links.splice(draggedIndex, 1);
    links.splice(targetIndex, 0, removed);

    // Update order values
    const updatedLinks = links.map((link, index) => ({
      ...link,
      order: index,
    }));

    // Optimistic update
    setPageData({ ...pageData, links: updatedLinks });

    // Update in backend
    try {
      await Promise.all(
        updatedLinks.map((link) =>
          fetch(`/api/links/${link.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: link.order }),
          })
        )
      );
      toast.success("Order updated!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Eoor updating order");
      fetchPageData(); // Revert on error
    }
  };

  if (loading || isLoadingPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-30 dark:opacity-40">
          <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 relative z-10"></div>
      </div>
    );
  }

  if (!pageData) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-x-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} />
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
                Groovetree
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
            >
              <RiShareFill className="w-5 h-5" />
              Share
            </button>

            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IoMdSettings className="w-5 h-5" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors hover:cursor-pointer"
              data-cy="logout-button"
            >
              <MdLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6 relative z-10 ">
        {/* Preview Page Button - Destaque Principal */}
        <div className="flex justify-center mb-6">
          <Link
            href={`/${pageData.slug}`}
            target="_blank"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-transparent text-gray-900 dark:text-white font-semibold text-base rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
            data-cy="page-preview-button"
          >
            {/* Borda com gradiente Aurora */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-green-500 to-purple-600 p-[2px]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-950"></span>
            </span>

            {/* Conteúdo do botão */}
            <BsEyeFill className="w-5 h-5 relative z-10" />
            <span className="relative z-10">See Your Page</span>
            <svg
              className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-950 border dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Profile
            </h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl text-gray-500 dark:text-gray-300 overflow-hidden">
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
              className="px-4 py-2 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 hover:cursor-pointer"
            >
              {uploadingAvatar ? "Uploading..." : "Choose Image"}
            </button>
          </div>

          {/* Profile Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Title
            </label>
            <input
              type="text"
              value={pageData.title}
              onChange={(e) => {
                const newPageData = { ...pageData, title: e.target.value };
                setPageData(newPageData);
                checkForUnsavedChanges(newPageData);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your artist name"
              data-cy="page-artist-name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={pageData.bio || ""}
              onChange={(e) => {
                const newPageData = { ...pageData, bio: e.target.value };
                setPageData(newPageData);
                checkForUnsavedChanges(newPageData);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Tell your audience about yourself"
              data-cy="page-bio-description"
            />
          </div>

          {/* Groovetree URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Groovetree URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                groovetree.vercel.app/
              </span>
              <input
                type="text"
                value={pageData.slug}
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="bg-white dark:bg-slate-950 border dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <IoMdSettings className="w-6 h-6 text-purple-600" />
            Page Customization
          </h2>

          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={pageData?.backgroundColor || "#000000"}
                  onChange={(e) => {
                    const newPageData = {
                      ...pageData!,
                      backgroundColor: e.target.value,
                    };
                    setPageData(newPageData);
                    checkForUnsavedChanges(newPageData);
                  }}
                  className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData?.backgroundColor || "#000000"}
                  onChange={(e) => {
                    const newPageData = {
                      ...pageData!,
                      backgroundColor: e.target.value,
                    };
                    setPageData(newPageData);
                    checkForUnsavedChanges(newPageData);
                  }}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-cy="page-background-color"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={pageData?.textColor || "#ffffff"}
                  onChange={(e) => {
                    const newPageData = {
                      ...pageData!,
                      textColor: e.target.value,
                    };
                    setPageData(newPageData);
                    checkForUnsavedChanges(newPageData);
                  }}
                  className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData?.textColor || "#ffffff"}
                  onChange={(e) => {
                    const newPageData = {
                      ...pageData!,
                      textColor: e.target.value,
                    };
                    setPageData(newPageData);
                    checkForUnsavedChanges(newPageData);
                  }}
                  placeholder="#ffffff"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-cy="page-text-color"
                />
              </div>
            </div>

            {/* Background Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Image URL
              </label>
              <input
                type="url"
                value={pageData?.backgroundImageUrl || ""}
                onChange={(e) => {
                  const newPageData = {
                    ...pageData!,
                    backgroundImageUrl: e.target.value,
                  };
                  setPageData(newPageData);
                  checkForUnsavedChanges(newPageData);
                }}
                placeholder="https://example.com/background.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                data-cy="page-background-image-url"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to use only background color
              </p>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </p>
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
                  Sample text
                </p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdatePage}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${hasUnsavedChanges
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              data-cy="page-save-customization-button"
            >
              <MdSave className="w-5 h-5" />
              {hasUnsavedChanges ? "Save Changes" : "Save Customization"}
            </button>
          </div>
        </div>

        {/* Shows Section */}
        <div className="bg-white dark:bg-slate-950 border dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-6 cursor-pointer"
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
                  className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      📍 {event.venue} - {event.city}
                      {event.state ? `, ${event.state}` : ""}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📅 {new Date(event.date).toLocaleDateString("pt-BR")}
                    </p>
                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mt-1 inline-flex items-center gap-1"
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
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No shows yet
                </p>
                <p className="text-sm dark:text-gray-400">
                  Click the button above to add your first show
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="bg-white dark:bg-slate-950 border dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
            className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-6 cursor-pointer ${photos.length >= 4
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No photos added yet
                </p>
                <p className="text-sm dark:text-gray-400">
                  Add up to 4 photos to the gallery
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white dark:bg-slate-950 border dark:border-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Links
          </h2>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-6 cursor-pointer"
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
                  draggable
                  onDragStart={(e) => handleDragStart(e, link.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, link.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, link.id)}
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-all group cursor-move ${dragOverItem === link.id
                      ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105"
                      : draggedItem === link.id
                        ? "border-gray-300 dark:border-gray-600 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md"
                    }`}
                >
                  <FaGripVertical className="text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {link.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                      <FaExternalLinkAlt className="w-3 h-3" />
                      {link.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No links yet
                </p>
                <p className="text-sm dark:text-gray-400">
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
          <div className="bg-white dark:bg-slate-950 backdrop-blur-md rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border dark:border-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Add Link
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
              {linkCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${selectedCategory === category.id
                      ? "bg-purple-600 dark:bg-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
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
                      className="flex items-center cursor-pointer gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                      <FaPlus className="text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 w-5 h-5 flex-shrink-0" />
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
          <div className="bg-white dark:bg-slate-950 backdrop-blur-md rounded-2xl max-w-md w-full shadow-2xl border dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingLink ? "Edit Link" : "New Link"}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLink(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={linkForm.title}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., My Spotify"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLink(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
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
          <div className="bg-white dark:bg-slate-950 backdrop-blur-md rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border dark:border-gray-800">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Share your page
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Social Media Buttons */}
              <div>
                <div className="flex gap-4 overflow-x-auto py-2 justify-center">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.name} className="flex flex-col items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleSocialShare(platform.url)}
                        className={`w-14 h-14 rounded-full ${platform.color} text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer`}
                        title={`Share on ${platform.name}`}
                      >
                        {platform.icon}
                      </button>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {platform.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Groovetree URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`groovetree.vercel.app/${pageData?.slug}`}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* View Page Button */}
              <Link
                href={`/${pageData?.slug}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <BsEyeFill className="w-4 h-4" />
                View Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal (Add/Edit) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-950 backdrop-blur-md rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-slate-950 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  placeholder="Ex: Summer Tour 2025"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, venue: e.target.value })
                  }
                  placeholder="Ex: Estádio Mineirão"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={eventForm.city}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, city: e.target.value })
                    }
                    placeholder="Ex: Belo Horizonte"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Ticket URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticket URL
                </label>
                <input
                  type="url"
                  value={eventForm.ticketUrl}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, ticketUrl: e.target.value })
                  }
                  placeholder="https://example.com/tickets"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ticket purchase link (optional)
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveEvent}
                className="w-full py-3 cursor-pointer bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
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
          <div className="bg-white dark:bg-slate-950 backdrop-blur-md rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-slate-950 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <MdPhotoLibrary className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="w-full cursor-pointer px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPEG, PNG, WebP or GIF (máx. 10MB for better quality)
                </p>
              </div>

              {/* Image Preview */}
              {(photoPreview || photoForm.imageUrl) && (
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview || photoForm.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Text that appears above the photo (optional, max. 100
                  characters)
                </p>
              </div>

              {/* Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  💡 <strong>Hint:</strong> Use square aspect ratio images (1:1)
                  for better visualization. Maximum of 4 photos.
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
