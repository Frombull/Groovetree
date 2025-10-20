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
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  // Se não houver fotos, não renderiza nada
  if (!photos || photos.length === 0) {
    return null;
  }

  // Limitar a 4 fotos
  const displayPhotos = photos.slice(0, 4);

  return (
    <section className="text-center mb-12">
      <h1 className="my-6 mt-8 font-sans text-3xl font-bold tracking-tight text-white text-balance">
        Nos palcos
      </h1>
      {/* Layout despojado: uma foto por linha, qualidade original */}
      <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-4">
        {displayPhotos.map((photo, index) => (
          <div key={photo.id} className="w-full group">
            {/* Imagem com qualidade original */}
            <div
              className="relative overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] w-full"
              style={{ minHeight: "400px" }}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Photo"}
                width={1200}
                height={800}
                quality={100}
                className="w-full h-auto object-contain"
                unoptimized={true}
                priority={index === 0}
              />
            </div>

            {/* Legenda embaixo da foto */}
            {photo.caption && (
              <p className="mt-4 text-white text-lg font-semibold tracking-wide">
                {photo.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
