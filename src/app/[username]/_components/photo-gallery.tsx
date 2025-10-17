"use client";

import TiltedCard from "@/app/components/TiltedCard";

const photos = [
  {
    id: 1,
    url: "/dj-performing-at-festival.jpg",
    alt: "Live performance at festival",
  },
  {
    id: 2,
    url: "/dj-in-studio-with-equipment.jpg",
    alt: "Studio session",
  },
  {
    id: 3,
    url: "/dj-at-nightclub-with-crowd.jpg",
    alt: "Club night",
  },
  {
    id: 4,
    url: "/dj-portrait-with-neon-lights.jpg",
    alt: "Artist portrait",
  },
];

export function PhotoGallery() {
  return (
    <section className="text-center">
      <h1 className="my-6 mt-8 font-sans text-3xl font-bold tracking-tight text-white text-balance">
        Nos palcos
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {photos.map((photo) => (
          <TiltedCard
            key={photo.id}
            imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
            altText="Kendrick Lamar - GNX Album Cover"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={<p className="tilted-card-demo-text">Laroc</p>}
          />
        ))}
      </div>
    </section>
  );
}
