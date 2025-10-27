"use client";
import Image from "next/image";
import { useState } from "react";

export default function Features() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseMove = (e, cardIndex) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calcula a rotação baseada na posição do mouse
    const rotateX = ((y - centerY) / centerY) * -20; // Máximo 20 graus
    const rotateY = ((x - centerX) / centerX) * 20; // Máximo 20 graus

    setMousePosition({ x: rotateY, y: rotateX });
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  const getCardTransform = (cardIndex) => {
    if (hoveredCard === cardIndex) {
      return {
        transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale3d(1.05, 1.05, 1.05)`,
      };
    }
    return {
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    };
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 break-words">
            Everything you need{" "}
            <span className="text-purple-600">in one place</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto break-words">
            Connect all your music platforms and social media in a single,
            beautiful page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { src: "/embedvideos.webp", alt: "Embed Videos Feature" },
            { src: "/promoteshows.webp", alt: "Promote Shows Feature" },
            { src: "/streammusic.webp", alt: "Stream Music Feature" },
          ].map((card, index) => (
            <div
              key={index}
              className="flex justify-center items-center "
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="transition-all duration-700 ease-out rounded-2xl overflow-hidden will-change-transform"
                style={{
                  ...getCardTransform(index),
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={620}
                  height={600}
                  className="transition-all duration-300"
                />

                {/* Overlay com gradiente dinâmico baseado na posição do mouse */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                    opacity: hoveredCard === index ? 0.1 : 0,
                    background:
                      hoveredCard === index
                        ? `radial-gradient(circle at ${
                            ((mousePosition.x + 20) / 40) * 100
                          }% ${
                            ((mousePosition.y + 20) / 40) * 100
                          }%, rgba(255,255,255,0.3), transparent 70%)`
                        : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
