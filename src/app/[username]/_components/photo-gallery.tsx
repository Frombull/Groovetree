"use client";

import Image from "next/image";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  isLight?: boolean;
}

export function PhotoGallery({ photos, isLight = false }: PhotoGalleryProps) {
  // Se não houver fotos, não renderiza nada
  if (!photos || photos.length === 0) {
    return null;
  }

  // Limitar a 4 fotos
  const displayPhotos = photos.slice(0, 4);

  return (
    <section className="mb-12">
      <h1
        className="text-center mb-8 font-sans text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: isLight ? "#000000" : "#ffffff" }}
      >
        Nos palcos
      </h1>

      {/* Layout responsivo: uma foto por linha */}
      <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-3xl mx-auto">
        {displayPhotos.map((photo, index) => (
          <div key={photo.id} className="w-full">
            {/* Container da imagem sem altura mínima fixa */}
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Photo"}
                width={1200}
                height={800}
                quality={100}
                className="w-full h-auto object-cover"
                unoptimized={true}
                priority={index === 0}
                style={{ maxHeight: "600px" }}
              />
            </div>

            {/* Legenda abaixo da foto */}
            {photo.caption && (
              <p
                className="mt-3 sm:mt-4 text-center text-sm sm:text-base font-medium tracking-wide px-2"
                style={{
                  color: isLight ? "#000000" : "#ffffff",
                  opacity: 0.9,
                }}
              >
                {photo.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
